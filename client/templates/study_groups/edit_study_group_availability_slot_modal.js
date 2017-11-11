import UHR from 'uhr';

Template.editStudyGroupAvailabilitySlotModal.onCreated(function () {
  let instance = this;
  instance.processing = new ReactiveVar(false);
});

Template.editStudyGroupAvailabilitySlotModal.helpers({
  processing() {
    return  Template.instance().processing.get();
  }
});

Template.editStudyGroupAvailabilitySlotModal.events({
  "submit .updateStudyAvailabilityGroupSlot": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});


    if ($.trim(template.find("#startHour").value) == 'HH') {
      return $('#startHour').css({ 'border': '#FF0000 1px solid'});
    }

    if ($.trim(template.find("#startMinute").value) == 'MM') {
      return $('#startMinute').css({ 'border': '#FF0000 1px solid'});
    }

    if ($.trim(template.find("#endHour").value) == 'HH') {
      return $('#endHour').css({ 'border': '#FF0000 1px solid'});
    }

    if ($.trim(template.find("#endMinute").value) == 'MM') {
      return $('#endMinute').css({ 'border': '#FF0000 1px solid'});
    }

    if (Number(template.find("#startHour").value) > Number(template.find("#endHour").value) ) {

      return $('#endHour').css({ 'border': '#FF0000 1px solid'});
    }

    if ($.trim(template.find("#startHour").value) == $.trim(template.find("#endHour").value)
        && $.trim(template.find("#startMinute").value) >= $.trim(template.find("#endMinute").value) ) {

      return $('#endMinute').css({ 'border': '#FF0000 1px solid'});
    }

    if ($.trim(template.find("#endHour").value) == 24 &&  $.trim(template.find("#endMinute").value) != 00) {
      return $('#endMinute').css({ 'border': '#FF0000 1px solid'});
    }

    const day = Number(template.find("#availabilityDay").value);
    const start_hour = Number(template.find("#startHour").value);
    const start_minute = Number(template.find("#startMinute").value);
    const end_hour = Number(template.find("#endHour").value);
    const end_minute = Number(template.find("#endMinute").value);

    const utc_result_start = UHR(day, start_hour, start_minute, 1);
    const utc_result_end = UHR(day, end_hour, end_minute, 1);
    // console.log("utc_result_start ", utc_result_start);
    // console.log("utc_result_end ", utc_result_end);

    const data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug,
      startDay: utc_result_start.day,
      startHour: utc_result_start.hour,
      startMinute: utc_result_start.minute,
      endDay: utc_result_end.day,
      endHour: utc_result_end.hour,
      endMinute: utc_result_end.minute,
      userTimeZoneOffsetInHours: new Date().getTimezoneOffset() / 60
    }

    // console.log(data);
    template.processing.set( true );

    Meteor.call("addAvailabilitySlot", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'Slot has been added', 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
