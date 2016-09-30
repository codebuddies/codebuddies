import {_} from 'meteor/erasaur:meteor-lodash';

console.log(_);

Template.hangoutsJoined.onCreated(function() {
  var instance = this;
   instance.limit = new ReactiveVar(5);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     var limit = instance.limit.get();
     var userId = FlowRouter.getParam('userId');
     instance.subscribe('hangouts', limit, userId);
   });

});


Template.hangoutsJoined.onRendered(function() {
    var instance = this;

    instance.loadHangouts = function() {
      var userId = FlowRouter.getParam('userId');
      var arr = Hangouts.find().fetch();
      var userHangouts = _.filter(arr, function(elem) { return elem.users.includes(userId) && elem.visibility == true});  //what about visibility?
      console.log("hangouts joined: " + userHangouts);
      return userHangouts;
    }

    instance.addMoreHangouts = function(){

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 8);

        }else{
           if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }
       }
    }

});

Template.hangoutsJoined.helpers({
  hangouts:function(){
    return Template.instance().loadHangouts();
  },
  status:function(){
     return  Template.instance().flag.get();
  }
});

Template.hangoutsJoined.events({
  "click #loadMore": function(event, template){
     template.addMoreHangouts();
  }
});
