Template.home.onCreated(function(){
  var title = "CodeBuddies | Home";
  var metaInfo = {name: "description", content: "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer Google Hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});
Template.registerHelper('searchMode',function(){
    return Session.get("searchMode");
});
Template.registerHelper('hangoutSearchQuery',function(){
    return Session.get("hangoutSearchQuery");
});

Template.home.rendered = function() {
   Meteor.call('getUserCount', function (err, result) {
      Session.set('userCount', result);
    });
};

Template.home.helpers({
  userCount: function() {
      var totalUsers = Session.get('userCount');
      //console.log(totalUsers);
      return totalUsers;
  },
  searchResults: function() {
    return Hangouts.search(Session.get('hangoutSearchQuery'));
  },
  booksSearchQuery: function() {
    return Session.get('hangoutSearchQuery');
  }
});


Template.home.events({
  "keyup #searchBox": function(event, template){
    event.preventDefault();
    //console.log(template.find(".searchTerm").value);
    var term = template.find(".searchTerm").value;
    if (_.isEmpty(term)){
     Session.set('hangoutSearchQuery', ' ');
     Session.set('searchMode',false);
   }else{
     Session.set('searchMode',true);
     Session.set('hangoutSearchQuery', term);
   }
  },
  "click #create-hangout-popup": function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Modal.show('createHangoutModal');
    }
  },
  "click #hangout-faq-popup": function() {
    Modal.show('hangoutFAQModal');
  },
  "click #statusTabs li.full-width-tab": function(e) {
    e.preventDefault();
    console.log(e.target);
    $(e.target).tab('show');
    var id = $(e.target).attr('data-id');
    $('[href=#' + id + id + ']').tab('show');
  },
  "click #statusTabs a": function(e) {
    e.preventDefault();
    console.log(e.target);
    $(e.target).parent('a').tab('show');
    var id = $(e.target).parent('a').attr('data-id');
    $('[href=#' + id + id + ']').tab('show');
  }

});
