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


    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug,
      day: Number(template.find("#availabilityDay").value),
      startHour: Number(template.find("#startHour").value),
      startMinute: Number(template.find("#startMinute").value),
      endHour: Number(template.find("#endHour").value),
      endMinute: Number(template.find("#endMinute").value),
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
