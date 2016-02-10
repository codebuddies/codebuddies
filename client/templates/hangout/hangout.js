Template.hangout.onCreated(function() {
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
});
