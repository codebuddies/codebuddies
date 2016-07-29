Meteor.publish("attendees", function(limit){
  if(this.userId) {
    return RSVPnotifications.find({createorId:this.userId},
                                  {sort: {date: -1}},
                                  {limit:limit});
  } else {
    this.ready();
  }

});
