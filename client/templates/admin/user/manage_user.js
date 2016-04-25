Template.registerHelper('userSearchQuery',function(){
    return Session.get("userSearchQuery");
});


Template.manageUser.helpers({
  searchResults: function() {
    return Meteor.users.search(Session.get('userSearchQuery'));
  },
});

Template.manageUser.events({
  "keyup #searchBox": function(event, template){
    event.preventDefault();
    //console.log(template.find(".searchTerm").value);
    var term = template.find(".searchTerm").value;
    if (_.isEmpty(term)){
     Session.set('userSearchQuery', ' ');
     Session.set('searchMode',false);
   }else{
     Session.set('searchMode',true);
     Session.set('userSearchQuery', term);
   }
  },
});
