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
  $('#statusTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    var id = $(this).attr('data-id');
    $('[href=#' + id + id + ']').tab('show');
  });

  $('#create-hangout-popup').click(function() {
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
  });

  $('#hangout-faq-popup').click(function() {
    Modal.show('hangoutFAQModal');
  })
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
})

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
  }
});
