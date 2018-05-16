// only running in production.
if (Meteor.settings.isModeProduction) {
  Kadira.connect(
    Meteor.settings.private.kadira.appId,
    Meteor.settings.private.kadira.appSecret
  );
}
