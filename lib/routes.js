FlowRouter.notFound = {
  action() {
    FlowLayout.render('layout', {top: 'header', main: 'pageNotFound' });
  },
};
FlowRouter.route('/', {
  name: 'home',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'home', footer: 'footer'});
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
    FlowLayout.render('layout', {top: 'header', main: 'hangout', footer: 'footer'});
  }
});

FlowRouter.route('/about', {
  name: 'about',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'about', footer: 'footer'});
  }
});

FlowRouter.route('/faq', {
  name: 'faq',
  action: function(params, queryParams) {
    FlowLayout.render('layout', {top: 'header', main: 'faq', footer: 'footer'});
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
    FlowLayout.render('layout', {top: 'header', main: 'profile', footer: 'footer'});
  }
});
