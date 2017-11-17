import UHR from 'uhr';

Template.availabilitySlotLocal.helpers({
  localSlotTime: function(){
    const slot = Template.instance().data;
    let result = UHR(slot.d, slot.h, slot.m, -1)
    result.hour = result.hour < 10  ? `0${result.hour}` : result.hour;
    result.minute = result.minute < 10  ? `0${result.minute}` : result.minute;
    return result;
  }
});
