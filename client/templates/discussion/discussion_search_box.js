Template.discussionSearchBox.onRendered(function(){
  if(Session.get("discussionSearchTerm") !== ''){
    $("#discussionSearchBox").val(Session.get("discussionSearchTerm"));
  }
});

Template.discussionSearchBox.helpers({
  discussionSearchMode:function(){
    return Session.get("discussionSearchMode");
  },
  discussionSearchTerm:function(){
    return Session.get("discussionSearchTerm");
  },
});


Template.discussionSearchBox.events({
  "keyup #discussionSearchBox": function(event, template){
    event.preventDefault();
    const  discussionSearchTerm = template.find("#discussionSearchBox").value;

    if (_.isEmpty(discussionSearchTerm)){
     Session.set('discussionSearchTerm', '');
     Session.set('discussionSearchMode',false);
    }else{
     Session.set('discussionSearchMode',true);
     Session.set('discussionSearchTerm', discussionSearchTerm);
    }
  },
  "click #clearSearch": function(event, template){
    Session.set('discussionSearchTerm', '');
    Session.set('discussionSearchMode',false);
  }
});
