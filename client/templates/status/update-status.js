//Initialize character counter value
var counterValue = 140;

Template.updateStatus.helpers({
    isWorking: function(type) {
        return type == 'working';
    },
    characterCount: counterValue
});

Template.updateStatus.events({
    //Track text for character counting
    'keypress #working-text': function(event) {
        //Check value and if 140 characters have been typed, the user can't type anymore
        if ($("#working-text").val().length < 140) {
            counterValue -= 1;
            console.log(counterValue);
            $('.charactersLeft').text(counterValue);
        } else if ($("#working-text").val().length == 140) {
            console.log("Sorry you can't type any more");
        }
    },

    //Increment counter value if the user presses backspace
    'keyup #working-text': function(event) {
        if (event.keyCode == 8) {
            counterValue++;
            $('.charactersLeft').text(counterValue);
        }
        if ($("#working-text").val().length == 0) {
            counterValue = 140;
            $('.charactersLeft').text(counterValue);
        }
    },

    //3 Buttons
    'click #update-working-btn': function(event) {
        if (!Meteor.userId()) {
            sweetAlert({
                title: TAPi18n.__("you_are_almost_there"),
                text: TAPi18n.__("login_update_status"),
                confirmButtonText: TAPi18n.__("ok"),
                type: 'info'
            });
        } else {
            var currentStatus = $('#working-text').val();

            if ($.trim(currentStatus) == '') {
                $('#topic').focus();
                sweetAlert({
                    title: TAPi18n.__("Working can't be empty"),
                    confirmButtonText: TAPi18n.__("ok"),
                    type: 'error'
                });
                return;
            }

            Meteor.call('setUserStatus', currentStatus, function(error, result) {});
            $('#working-text').val('');
        }
    },
    'click #update-learned-btn': function(event) {
        if (!Meteor.userId()) {
            sweetAlert({
                title: TAPi18n.__("you_are_almost_there"),
                text: TAPi18n.__("login_update_status"),
                confirmButtonText: TAPi18n.__("ok"),
                type: 'info'
            });
        } else {
            var learningStatus = $('#learned-text').val();

            if ($.trim(learningStatus) == '') {
                $('#topic').focus();
                sweetAlert({
                    title: TAPi18n.__("Accomplishment can't be empty"),
                    confirmButtonText: TAPi18n.__("ok"),
                    type: 'error'
                });
                return;
            }
            var data = {
                user_id: Meteor.userId(),
                username: Meteor.user().username,
                title: learningStatus,
            }
            Meteor.call("addLearning", data, function(error, result) {});
            $('#learned-text').val('');
        }
    },
    'click .btn-hangout-status': function(event) {
        var currentType = $(event.currentTarget).attr('data-type');
        if (currentType !== undefined)
            Meteor.call("setHangoutStatus", currentType, function(error, result) {});
    },
    'click .btn-hangout-status': function(event) {
        var currentType = $(event.currentTarget).attr('data-type');
            if (currentType !== undefined) {
              Meteor.call("setHangoutStatus", currentType, function(error, result) {});
              var bgColor;
              switch (currentType) {
                case "silent":
                    bgColor = "#c9302c";
                  break;
                case "teaching":
                    bgColor = "#ec971f";
                  break;
                case "collaboration":
                    bgColor = "#449d44";
                  break;
                default: break;
              }
              $(".btn-hangout-status").each(function(index) {
                $(this).css("background-color","");
              });
              $(event.currentTarget).css("background-color",bgColor);
            }
          }
});
