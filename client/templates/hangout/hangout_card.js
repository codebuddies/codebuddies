Template.hangoutCard.helpers({
  truncate: function(topic){
    return topic.truncate()
  }
});

Template.hangoutCard.events({
  "click #visitor": function(event, template){
    event.preventDefault();
    sweetAlert({
      title: TAPi18n.__("sign_in_to_continue"),
      confirmButtonText: TAPi18n.__("ok"),
      type: 'info'
    });
  }
});
