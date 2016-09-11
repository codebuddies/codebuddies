Template.hangoutList.onCreated(function() {
  var instance = this;
   instance.limit = new ReactiveVar(5);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     var limit = instance.limit.get();
     var subscription = instance.subscribe('hangouts', limit);
   });

   instance.loadHangouts = function() {
    //  console.log('hangout count inside template', Hangouts.find().count());
     return Hangouts.find();
   }

});


Template.hangoutList.onRendered(function() {
    var instance = this;

    instance.loadmoreHangouts = function(){
      if(Hangouts.find().count() === instance.limit.get()){
        instance.limit.set(instance.limit.get() + 5);
      }else {
        if(Hangouts.find().count() < instance.limit.get()){
          instance.flag.set(true);
        }
      }
    }


});

Template.hangoutList.helpers({
  hangouts:function(){
    return Template.instance().loadHangouts();
  },
  status:function(){
     return  Template.instance().flag.get();
  }
});

Template.hangoutList.events({
  "click #loadMore": function(event, template){
    template.instance().loadmoreHangouts();
  }
});




// Template.hangoutList.onCreated(function() {
//   var self = this;
//   self.pageSize = 5;
//   self.currentCount = new ReactiveVar(this.pageSize);
//   self.loadMore = new ReactiveVar(false);
//   self.hangoutsCount = 0;
//   self.loadMoreText = new ReactiveVar(TAPi18n.__("load_more"));
//   Meteor.call('getHangoutsCount', Meteor.userId(), function(err, result) {
//     self.hangoutsCount = result.hangoutsCount;
//     if (self.hangoutsCount > self.pageSize) {
//       self.loadMore.set(true);
//     }
//     self.currentCount.set(self.pageSize);
//     var totalSizeStored = Session.set('totalSizeStored', self.hangoutsCount);
//     var pageSize = self.pageSize;
//     var totalSize = self.hangoutsCount;
//     var currentSize = self.currentCount.get();
//     var currentPage = (parseInt(currentSize / pageSize) + 1);
//     var totalPages = parseInt(Math.ceil(totalSize / pageSize));
//     self.loadMoreText.set(TAPi18n.__("load_page", {start: currentPage, total: totalPages}));
//   });
//   self.ready = new ReactiveVar(false);
// });
//
// Template.hangoutList.helpers({
//   isReady: function() {
//     var template = Template.instance();
//     template.ready.set(FlowRouter.subsReady());
//     return template.ready.get();
//   },
//   hangouts: function () {
//     var template = Template.instance();
//     if (!template.ready.get()) return null;
//     var size = template.currentCount.get();
//     return Hangouts.find({},{ sort: { start: -1 }, limit: size});
//   },
//   showLoadMore: function() {
//     return Template.instance().loadMore.get();
//   },
//   loadMoreText: function() {
//     var template = Template.instance();
//     var pageSize = template.pageSize;
//     var currentSize = template.currentCount.get();
//     if (template.hangoutsCount > 0) {
//       var totalSize = template.hangoutsCount;
//       var currentPage = (parseInt(currentSize / pageSize) + 1);
//       var totalPages = parseInt(Math.ceil(totalSize / pageSize));
//       template.loadMoreText.set(TAPi18n.__("load_page", {start: currentPage, total: totalPages}));
//     }
//     return template.loadMoreText.get();
//   }
// });
//
// Template.hangoutList.events({
//   'click #btn-load-more': function() {
//     var template = Template.instance();
//     var pageSize = template.pageSize;
//     var totalSize = Session.get('totalSizeStored');
//     var currentSize = template.currentCount.get();
//     var newSize = currentSize;
//
//     if ((newSize + pageSize) < totalSize)
//       newSize += pageSize;
//     else {
//       newSize += (totalSize - newSize);
//       template.loadMore.set(false);
//     }
//     template.currentCount.set(newSize);
//   }
// });
