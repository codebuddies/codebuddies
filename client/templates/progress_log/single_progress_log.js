Template.singleProgressLog.onCreated(function () {

  const instance = this;
  instance.subscribe('progressLogsById', FlowRouter.getParam('logId'));

});


Template.singleProgressLog.helpers({
  progressLog() {
    return ProgressLogs.findOne({"_id": FlowRouter.getParam('logId')});
  }
});
