/**
* Mark Activity As Read
* @function
* @name markActivityAsRead
* @param {Object} data object
* @return {Boolean} true on success
*/
Meteor.methods({
  markActivityAsRead:function(data){
    check(data, {
      activityId: String,
    });
    console.log("markItemAsRead", data);


    Activities.update({ _id: data.activityId },
                              {$push: { read: this.userId } });

  },
});

/**
* Unread Activity Count
* @function
* @name unreadActivityCount
* @return {Number} returns the number of unread activity count
*/
Meteor.methods({
  unreadActivityCount : function(){
    return Activities.find({'read':{$ne:this.userId}}).count();
  }
});
