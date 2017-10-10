Meteor.methods({
  editStatus: function(data) {
    check(data, {
      user_id: String,
      status: String,
      study_group_id: String
    });

    console.log(data);

    if (!this.userId) {
      throw new Meteor.Error('Members.methods.editStatus.not-logged-in', 'Must be logged in to edit the member status.');
    }
    StudyGroups.update({_id: data.study_group_id, 'members.id': data.user_id },
                      {$set: {'members.$.status': data.status, 'members.$.status_CreatedAt': new Date()} });

    return true;
  }
});
