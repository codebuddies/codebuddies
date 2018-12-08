Template.message_bubble.events({
  "click .ib-from-them": function(event, template) {
    Modal.show("report_message_modal", this);
  }
});
