Template.home.rendered = function() {
   Meteor.call('getUserCount', function (err, result) {
      Session.set('userCount', result);
    });
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
  });

  $('#hangout-faq-popup').click(function() {
    Modal.show('hangoutFAQModal');
  })
};

Template.home.helpers({
  userCount: function() {
      var totalUsers = Session.get('userCount');
      //console.log(totalUsers);
      return totalUsers;
  }
})