Meteor.publish("attendees", function(limit){

  return RSVPnotifications.find({createorId:this.userId},
                                {sort: {date: -1}},
                                {limit:limit});
});
