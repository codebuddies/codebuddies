import mcapi from 'mailchimp-api';

if(Meteor.settings.isModeProduction){

  mc = new mcapi.Mailchimp(Meteor.settings.private.mailchimp.apiKey);
    // @TODO: legacy code remove this.
    addUserToMailingList = (email, merge_vars) => {
    mc.lists.subscribe({id:Meteor.settings.private.mailchimp.listId,
                        email:{email:email},
                        merge_vars: merge_vars,
                        double_optin:true,
                        update_existing: true
                        },
    function(data) {

      // console.log("User subscribed successfully! Look for the confirmation email.");
      // console.log("data", data);

     },
     function(error) {
      //  if (error.error) {
      //    console.log(error.code + ": " + error.error);
       //
      //  } else {
      //    console.log("There was an error subscribing that user");
      //  }

     });

  };

  // @TODO:
  // legacy code
  // this is still being used if someone archive their account.
  // remove this once migrate to other services.
  removeUserFromMailingList = (email) => {
    mc.lists.unsubscribe({"id":Meteor.settings.private.mailchimp.listId,
                          "email": {
                              "email": email
                          },
                          "delete_member": true,
                          "send_goodbye": true,
                          "send_notify": true
                        },
                        function(data) {

                          console.log("User unsubscribed successfully! confirmation email.");
                          console.log("data", data);

                         },
                         function(error) {
                           if (error.error) {
                             console.log(error.code + ": " + error.error);

                           } else {
                             console.log("There was an error unsubscribing that user");
                           }

                         });
  };

}
