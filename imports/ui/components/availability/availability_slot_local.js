import UHR from "uhr";

Template.availabilitySlotLocal.helpers({
  localSlotTime: function() {
    const utcSlot = Template.instance().data;

    let localSlot = UHR(utcSlot.d, utcSlot.h, utcSlot.m, -1);
    localSlot.hour = localSlot.hour < 10 ? `0${localSlot.hour}` : localSlot.hour;
    localSlot.minute = localSlot.minute < 10 ? `0${localSlot.minute}` : localSlot.minute;
    return localSlot;
  }
});
