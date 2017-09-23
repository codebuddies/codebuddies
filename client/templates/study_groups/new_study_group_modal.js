
Template.newStudyGroupModal.onCreated(function() {
  let instance = this;
  instance.processing = new ReactiveVar(false);
  instance.titleCharCount = new ReactiveVar(70);
  instance.taglineCharCount = new ReactiveVar(60);
});

Template.newStudyGroupModal.onRendered(function() {
  let instance = this;
  let titleCharCount =  $("#title").val().length || 0;
  instance.titleCharCount.set(70 - titleCharCount)

  let taglineCharCount =  $("#tagline").val().length || 0;
  instance.taglineCharCount.set(60 - taglineCharCount)

  Meteor.setTimeout(function () {
    const tags = [ 'JavaScript', 'Python', 'Go', 'CSS', 'PHP', 'R', 'NodeJS', 'D3', 'MongoDB', 'Meteor', 'Java'];
    instance.$(".study-group-tags-multiple", tags).select2({
      placeholder: "Tags (required)",
      data: tags,
      tags: true,
      tokenSeparators: [','],
      allowClear: true
    });
  },500)

});

Template.newStudyGroupModal.helpers({
  processing() {
    return  Template.instance().processing.get();
  },
  titleCharCount() {
    return  Template.instance().titleCharCount.get();
  },
  taglineCharCount() {
    return  Template.instance().taglineCharCount.get();
  }
});

Template.newStudyGroupModal.events({
  "keyup #title": function(event, template){
    let titleCharCount =  $("#title").val().length || 0;
    template.titleCharCount.set(70 - titleCharCount)
  },
  "keyup #tagline": function(event, template){
    let taglineCharCount =  $("#tagline").val().length || 0;
    template.taglineCharCount.set(60 - taglineCharCount)
  },
  "submit .newStudyGroup": function(event, template){

    event.preventDefault();

    if ($.trim(template.find("#title").value) == '') {
      return Bert.alert( 'Please input a name for your study group.', 'warning', 'growl-top-right' );
    }
    if ($.trim(template.find("#tagline").value) == '') {
      return Bert.alert( 'Please input a tagline for your study group.', 'warning', 'growl-top-right' );
    }
    if ( $("#title").val().length > 70) {
      $('#title').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please shorten your title.', 'warning', 'growl-top-right' );
    }
    if ( $("#tagline").val().length > 60) {
      $('#tagline').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please shorten your tagline.', 'warning', 'growl-top-right' );
    }

    if (!$(".study-group-tags-multiple").val() ||$(".study-group-tags-multiple").val().length <= 2) {
      return Bert.alert( 'Please select at least 3 tags. ', 'warning', 'growl-top-right' );
    }


    const data = {
      title:template.find('#title').value,
      slug:template.find('#title').value.replace(/\s+/g, '-').toLowerCase(),
      tagline:template.find('#tagline').value,
      tags: $(".study-group-tags-multiple").val()
    }
    // console.log(data);

    template.processing.set( true );

    Meteor.call("createNewStudyGroup", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        template.find('#title').value="";
        template.find('#tagline').value="";

        Modal.hide();
        FlowRouter.go('my study groups');
        Bert.alert({
          type: 'success',
          message: 'Congratulations! Your study group "' + data.title + '" has been created.',
          icon: 'fa-check-circle',
          hideDelay: 6500
        });
      }
    });

  }
});
