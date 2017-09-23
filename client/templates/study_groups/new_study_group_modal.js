Template.newStudyGroupModal.onRendered(function() {

  const instance = this;
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

Template.newStudyGroupModal.events({
  "submit .newStudyGroup": function(event, template){

    event.preventDefault();

    if ($.trim(template.find("#title").value) == '') {
      return Bert.alert( 'Please input a name for your study group.', 'warning', 'growl-top-right' );
    }
    if ($.trim(template.find("#tagline").value) == '') {
      return Bert.alert( 'Please input a tagline for your study group.', 'warning', 'growl-top-right' );
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

    Meteor.call("createNewStudyGroup", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
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
