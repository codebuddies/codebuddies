import UHR from 'uhr';

Template.availabilitySlotLocal.helpers({
  localSlotTime: function(){
    const slot = Template.instance().data;
    return UHR(slot.d, slot.h, slot.m, -1)
  }
});
