import UHR from "uhr";

Template.editStudyGroupAvailabilitySlotModal.onCreated(function() {
  let instance = this;
  instance.processing = new ReactiveVar(false);
});

getHour = slot => {
  return Number(slot.slice(0, -3));
};

getMinute = (slot, hour) => {
  return Number(slot.slice(`${hour}`.length + 1, slot.length));
};

Template.editStudyGroupAvailabilitySlotModal.onRendered(function() {
  let instance = this;
  instance.$(".timepicker").timepicker({
    timeFormat: "H:mm",
    interval: 60,
    minTime: "00:00",
    maxTime: "23:59",
    defaultTime: "0",
    startTime: "00:00",
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    zindex: 99999999
  });
});

Template.editStudyGroupAvailabilitySlotModal.helpers({
  processing() {
    return Template.instance().processing.get();
  }
});

Template.editStudyGroupAvailabilitySlotModal.events({
  "submit .updateStudyAvailabilityGroupSlot": function(event, template) {
    event.preventDefault();

    $(".timepicker").css({ border: "1px solid #cccccc" });

    const day = Number(template.find("#availabilityDay").value);

    const slotStartTime = template.find(".start-time").value;
    const slotEndTime = template.find(".end-time").value;

    const startHour = getHour(slotStartTime);
    const endHour = getHour(slotEndTime);

    const startMinute = getMinute(slotStartTime, startHour);
    const endMinute = getMinute(slotEndTime, endHour);

    if (startHour == endHour && startMinute >= endMinute) {
      return $(".end-time").css({ border: "#FF0000 1px solid" });
    }

    if (startHour > endHour) {
      return $(".end-time").css({ border: "#FF0000 1px solid" });
    }

    const utcStartSlot = UHR(day, startHour, startMinute, 1);
    const utcEndSlot = UHR(day, endHour, endMinute, 1);

    const data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug,
      startDay: utcStartSlot.day,
      startHour: utcStartSlot.hour,
      startMinute: utcStartSlot.minute,
      endDay: utcEndSlot.day,
      endHour: utcEndSlot.hour,
      endMinute: utcEndSlot.minute,
      userTimeZoneOffsetInHours: new Date().getTimezoneOffset() / 60
    };

    // console.log(data);
    template.processing.set(true);

    Meteor.call("addAvailabilitySlot", data, function(error, result) {
      if (error) {
        template.processing.set(false);
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        template.processing.set(false);
        Bert.alert("Slot has been added", "success", "growl-top-right");
        Modal.hide();
      }
    });
  }
});
