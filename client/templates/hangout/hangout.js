Template.hangout.onCreated(function() {
  var title = "Code Buddies | Hangout";
  DocHead.setTitle(title);
  var self = this;
  self.hangout = new ReactiveVar();
  self.isReady = new ReactiveVar(false);

  var hangoutId = FlowRouter.getParam('hangoutId');
  self.autorun(function() {
    var result = ReactiveMethod.call('getHangout', hangoutId);
    self.hangout.set(result);
    self.isReady.set(true);
  });
});

Template.hangout.helpers({
  hangout: function() {
    if (Template.instance().isReady.get())
      return Template.instance().hangout.get();
  },
  isReady: function() {
    return Template.instance().isReady.get();
  },
  isInProgress: function(hangout) {
    return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;
  },
});
