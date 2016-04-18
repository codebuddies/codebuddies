FlowRouter.notFound = {
  action() {
    BlazeLayout.render('layout', {top: 'header', main: 'pageNotFound' });
  },
};
FlowRouter.route('/', {
  name: 'home',
  action: function(params, queryParams) {
    BlazeLayout.render('layout', {top: 'header', main: 'home', footer: 'footer'});
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
    BlazeLayout.render('layout', {top: 'header', main: 'hangout', footer: 'footer'});
  }
});

FlowRouter.route('/about', {
  name: 'about',
  action: function(params, queryParams) {
    BlazeLayout.render('layout', {top: 'header', main: 'about', footer: 'footer'});
  }
});

FlowRouter.route('/faq', {
  name: 'faq',
  action: function(params, queryParams) {
    BlazeLayout.render('layout', {top: 'header', main: 'faq', footer: 'footer'});
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
    BlazeLayout.render('layout', {top: 'header', main: 'profile', footer: 'footer'});
  },
  subscriptions: function(params, queryParams) {
    this.register('learnings', Meteor.subscribe('ownLearnings'));
    this.register('hangouts', Meteor.subscribe('hangoutsJoined'));
  }
});

var admin = FlowRouter.group({
  prefix: "/admin",
});

admin.route('/', {
  name: 'admin',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'adminLanding'});
  }
});

admin.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'dashboard'})
  }
});
admin.route('/dashboard/:sortUserAs', {
  name: 'dashboard',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'sortUserAs'})
  }
});
admin.route('/manage-users', {
  name: 'manage user',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'manageUser'})
  }
});
admin.route('/users/:role', {
  name: 'moderator',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'usersByRole'})
  }
});
admin.route('/user/:userId', {
  name: 'user',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'userById'})
  }
});
admin.route('/notifications', {
  name: 'notifications',
  action: function() {
    BlazeLayout.render('adminLayout',{content: 'isAdmin', targetTemplate: 'allNotification'})
  }
});
