/**
* Add Availability Slot
* @function
* @name addAvailabilitySlot
* @param {Object} data object
* @return {Boolean} true on success
*/
Meteor.methods({
 addAvailabilitySlot:function(data){
   check(data,{
     studyGroupId: String,
     studyGroupTitle: String,
     studyGroupSlug: String,
     startDay: Number,
     startHour: Number,
     startMinute: Number,
     endDay: Number,
     endHour: Number,
     endMinute: Number,
     userTimeZoneOffsetInHours: Number
   });

   if (!this.userId) {
     throw new Meteor.Error("unauthorized", "Unauthorized");
   }

   const loggedInUser =  Meteor.user();
   if (!loggedInUser || !Roles.userIsInRole(loggedInUser,['owner', 'admin', 'moderator', 'member'], data.studyGroupId)) {
    throw new Meteor.Error('Availabilities.methods.addAvailabilitySlot.accessDenied','Cannot add Slot, Access denied');
   }
   const username = loggedInUser.username;
   const avatar = loggedInUser.profile.avatar.default;

   const availability = {
     study_group:{
       id: data.studyGroupId,
       title: data.studyGroupTitle,
       slug: data.studyGroupSlug
     },
     author:{
       id: loggedInUser._id,
       name: username,
       avatar: avatar
     },
     start_day: data.startDay,
     start_hour: data.startHour,
     start_minute: data.startMinute,
     end_day: data.endDay,
     end_hour: data.endHour,
     end_minute: data.endMinute,
     user_tz_offset_hours: data.userTimeZoneOffsetInHours,
     createdAt: new Date()
   }

   // console.log(availability);


   const id = Availabilities.insert(availability);
   if (id) {
     return true
   }
 }
});

/**
* Remove Availability Slot
* @function
* @name removeAvailabilitySlot
* @param {Object} data object
* @return {Boolean} true on success
*/
Meteor.methods({
 removeAvailabilitySlot:function(data){
   check(data,{
     availabilityId: String,
     studyGroupId: String
   });

   if (!this.userId) {
     throw new Meteor.Error("unauthorized", "Unauthorized");
   }

   const loggedInUser =  Meteor.user();
   if (!loggedInUser || !Roles.userIsInRole(loggedInUser,['owner', 'admin', 'moderator', 'member'], data.studyGroupId)) {
    throw new Meteor.Error('Availabilities.methods.removeAvailabilitySlot.accessDenied','Cannot remove slot, Access denied');
   }

   return Availabilities.remove({_id:data.availabilityId, "author.id": loggedInUser._id });

 }
});
