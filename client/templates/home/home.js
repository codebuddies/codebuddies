Template.home.rendered = function() {
  $('#statusTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    var id = $(this).attr('data-id');
    $('[href=#' + id + id + ']').tab('show');
  });

  $('#create-hangout-popup').click(function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Modal.show('createHangoutModal');
    }
  })
};
