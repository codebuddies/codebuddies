
Template.archivedUsers.helpers({
  users:function(){
    return ArchivedUsers.find({},{sort: {archived_at : -1}});
  }
});
