FlowRouter.notFound = {
  action() {
    FlowLayout.render('layout', {top: 'header', main: 'pageNotFound' });
  },
};
FlowRouter.route('/', {
  name: 'home',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'home'});
  },
  subscriptions: function(params, queryParams) {
    this.register('status', Meteor.subscribe('userStatus'));
    this.register('learnings', Meteor.subscribe('learnings'));
    this.register('hangouts', Meteor.subscribe('hangouts'));
  }
});

FlowRouter.route('/hangout/:hangoutId', {
  name: 'hangout',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'hangout'});
  }
});

FlowRouter.route('/about', {
  name: 'about',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'about'});
  }
});

FlowRouter.route('/faq', {
  name: 'faq',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'faq'});
  }
});

FlowRouter.route('/profile/:name', {
  name: 'profile',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.userId()) {
      redirect('/');
    }
  }],
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'profile'});
  }
});
