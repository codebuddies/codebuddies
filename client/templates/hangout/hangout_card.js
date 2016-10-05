Template.hangoutCard.helpers({
  truncate: function(topic){
    return topic.truncate()
  },
  getType: function(type) {
    if (type == 'silent') {
      return 'fa-microphone-slash text-danger-color';
    } else if (type == 'teaching') {
      return 'fa-user text-warning-color';
    } else if (type == 'collaboration') {
      return 'fa-users text-success-color';
    }
  },
  getDate: function(startDate) {
    const tz = TimezonePicker.detectedZone();
    return moment(startDate).tz(tz).format('ddd MMMM Do YYYY, h:mm a z');
  },
});
