var IMPF = function (actor,subject,current,past){
      var incident = {};
      if(current === "inactive"){
        if(past === "user"){
          incident.action = "blocked";
          incident.matter = "none";
          incident.icon = "fa-ban";
          return incident;

        }else{
          incident.action = "revoked";
          incident.matter = "’s " + past + " privileges. & blocked "
          incident.icon = "fa-ban";
          return incident;

        }
      }
      if(current === "user"){
        if(past ==="inactive"){
          incident.action = "unblocked";
          incident.matter = "none";
          incident.icon = "fa-bell";
          return incident;

        }else{
          incident.action = "revoked";
          incident.matter = "’s " + past + " privileges. ";
          incident.icon = "fa-exclamation-circle";
          return incident;

        }
      }
      if(current !== "user" && current !=="inactive"){
        if(past === "inactive"){
          incident.action = "unblocked";
          incident.matter = " & granted " +  current + " privileges. ";
          incident.icon = "fa-bell";
          return incident;

        }else if(past === "user"){
          incident.action = "granted";
          incident.matter = " " + current + " privileges. ";
          incident.icon = "fa-bell";
          return incident;
        }else{
          incident.action = "revoked";
          incident.matter = "’s " + past + " privileges, & granted " + current + " privileges. ";
          incident.icon = "fa-exclamation-circle";
          return incident;

        }
      }


}



Meteor.methods({
  updateRoles: function (subjectId, subjectUsername, current, past) {
    var actor = Meteor.user()
    if (!actor || !Roles.userIsInRole(actor, ['admin','moderator'])) {
      throw new Meteor.Error(403, "Access denied")
    }

    if(current === "inactive"){
      Meteor.users.update({ _id: subjectId }, {$set: { "services.resume.loginTokens" : [] }});
      Roles.setUserRoles(subjectId, current);
    }else{

      Roles.setUserRoles(subjectId, current);
    }

    var incident = IMPF(actor.username, subjectUsername , current, past);
    var notification = {
      actorId : actor._id,
      actorUsername : actor.username || actor.user_info.name,
      subjectId : subjectId,
      subjectUsername : subjectUsername,
      createdAt : new Date(),
      currentStatus: current,
      pastStatus: past,
      read:[actor._id],
      action : incident.action,
      matter : incident.matter,
      icon : incident.icon,
      type : "role update",
    }
    Notifications.insert(notification);
  },
  markAsRead:function(notificationId){

      Notifications.update(
        { _id: notificationId },
        {
          $push: { read: this.userId }
        }
      );

  },
  monthlyActiveUsersCount: function () {
    return Meteor.users.find({'status.lastLogin.date':{$gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}}).count();
  },
  dailyNewUsersCount: function () {
    return Meteor.users.find({'createdAt':{$gt: new Date(Date.now() - 1* 24 * 60 * 60 * 1000)}}).count();
  },
  onlineUserCount: function () {
    return Meteor.users.find({ "status.online": true }).count();
  },
  blockedUserCount: function () {
    return Meteor.users.find({'roles':'inactive'}).count();
  },
})
