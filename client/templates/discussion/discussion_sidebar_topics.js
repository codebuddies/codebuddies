Template.discussionSidebarTopic.onCreated(function () {
  let instance = this ;
  instance.activeTopics = new ReactiveVar(0);
  instance.recentTopics = new ReactiveVar(0);

  let data = {
    type: 'active',
    id: FlowRouter.getParam('discussionId')
  }

  Meteor.call('discussions.getTopics', data ,function(error, result) {
			if(error){
				console.log("error", error);
			}
			if(result){
				instance.activeTopics.set(result);
			}
	});

  data.type = 'recent'
  Meteor.call('discussions.getTopics', data ,function(error, result) {
			if(error){
				console.log("error", error);
			}
			if(result){
				instance.recentTopics.set(result);
			}
	});

});
Template.discussionSidebarTopic.helpers({
  activeTopics: function(){
    return Template.instance().activeTopics.get();
  },
  recentTopics: function(){
    return Template.instance().recentTopics.get();
  },
});
