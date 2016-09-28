Meteor.publish("learnings", function(limit) {
  if(this.userId){
    return Learnings.find({},
                          {sort: {created_at: -1}, limit: limit});
  }else{
    this.ready();
  }

});

Meteor.publish("ownLearnings", function(limit) {
  if(this.userId){
    return Learnings.find({userId: this.userId},
                          {sort: {created_at: -1}, limit: limit});
  }else{
    this.ready();
  }

});
