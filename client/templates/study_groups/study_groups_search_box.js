Template.studyGroupsSearchBox.onRendered(function(){
  if(Session.get("sgSearchTerm") !== ''){
    $("#sgSearchBox").val(Session.get("sgSearchTerm"));
  }
});

Template.studyGroupsSearchBox.helpers({
  sgSearchMode:function(){
    //console.log(Session.get("landingPageSearchMode"));
    return Session.get("sgSearchMode");
  },
  sgSearchTerm:function(){
    return Session.get("sgSearchTerm");
  },
});


Template.studyGroupsSearchBox.events({
  "keyup #sgSearchBox": function(event, template){
    event.preventDefault();
    const  sgSearchTerm = template.find("#sgSearchBox").value;
    console.log(sgSearchTerm);
    if (_.isEmpty(sgSearchTerm)){
     Session.set('sgSearchTerm', '');
     Session.set('sgSearchMode',false);
    }else{
     Session.set('sgSearchMode',true);
     Session.set('sgSearchTerm', sgSearchTerm);
    }
  },
  "click #clearSearch": function(event, template){
    Session.set('sgSearchTerm', '');
    Session.set('sgSearchMode',false);
  }
});
