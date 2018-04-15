Template.homeLoggedIn.onCreated(function(){
  var title = "CodeBuddies | Home";
  var metaInfo = {name: "description", content: "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized screensharing/pair-programming hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  this.autorun(() => {
    this.subscribe("userStatus");
    if (!_.isEmpty(Session.get('hangoutSearchTerm'))){
    this.subscribe('hangoutSearch',Session.get('hangoutSearchTerm'));
    }
  });

});

Template.homeLoggedIn.helpers({
  userCount: function() {
      var totalUsers = Session.get('userCount');
      //console.log(totalUsers);
      return totalUsers;
  },
  searchResults: function() {
    return Hangouts.search(Session.get('hangoutSearchTerm'));
  },
  hangoutSearchTerm () {
    return Session.get("hangoutSearchTerm");
  },
  hangoutSearchMode () {
    // console.log(Session.get('hangoutSearchMode'));
    return Session.get("hangoutSearchMode");
  }
});


Template.homeLoggedIn.events({
  "keyup #searchBox": function(event, template){
    event.preventDefault();
    // console.log(template.find(".searchTerm").value);
    var term = template.find(".searchTerm").value;
    if (_.isEmpty(term)){
     Session.set('hangoutSearchTerm', '');
     Session.set('hangoutSearchMode',false);
   }else{
     Session.set('hangoutSearchMode',true);
     Session.set('hangoutSearchTerm', term);
   }
  },
  "click #create-hangout-popup": function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("sign_in_with_slack"),
        type: 'info'
      },
      function(){
        var options = {
          requestPermissions: ['identity.basic', 'identity.email']
        };
        Meteor.loginWithSlack(options);
      });
    } else {
      Modal.show('createHangoutModal');
    }
  },
  "click #hangout-faq-popup": function() {
    Modal.show('hangoutFAQModal');
  },
  "click #clearSearch": function(event, template){
    Session.set('hangoutSearchTerm', "");
    Session.set('hangoutSearchMode', false);
  }

});
