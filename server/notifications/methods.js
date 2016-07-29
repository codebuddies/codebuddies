Meteor.methods({
  markItRead:function(rsvpId){
    check(rsvpId, String);
    if (!this.userId) {
      throw new Meteor.Error('RSVPnotifications.methods.markItRead.not-logged-in', 'Must be logged in to mark it read.');
    }
    RSVPnotifications.update({ _id: rsvpId },{$set:{seen:true}});
  }
});


Meteor.methods({
  removeRSVPnotifications:function(userId){
    check(userId, String);
    if (this.userId !== userId) {
      throw new Meteor.Error('RSVPnotifications.methods.removeRSVPnotifications.not-logged-in', 'Must be logged in to remove RSVP.');
    }
    return RSVPnotifications.update({'createorId': userId},
                           {$set: {visibility: false}},
                           {multi: true});



  }
});
