Meteor.methods({
  getImages: function() {
      return JSON.parse(Assets.getText('about.json'));
  }
});
