Template.discussionSidebarNotification.events({
  "click #subscribe": function(event, template){
     event.preventDefault();
     const data = {
       id: this._id
     }

     Meteor.call("discussions.subscribe", data, function(error, result){
       if(error){
         Bert.alert( error.reason , 'danger', 'growl-top-right' );
       }
       if(result){
         Bert.alert( 'Subscribed!' , 'success', 'growl-top-right' );
       }
     });

  },
  "click #unsubscribe": function(event, template){
    event.preventDefault();
    const data = {
      id: this._id
    }

    Meteor.call("discussions.unsubscribe", data, function(error, result){
      if(error){
        Bert.alert( error.reason , 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Unsubscribed!' , 'success', 'growl-top-right' );
      }
    });

  },
});
