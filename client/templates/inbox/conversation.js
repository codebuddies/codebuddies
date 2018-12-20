import moment from "moment";
import _ from "lodash";
Template.conversation.onCreated(function() {
  let instance = this;
  const title = "CodeBuddies | conversation";
  instance.limit = new ReactiveVar(12);
  instance.flag = new ReactiveVar(false);
  DocHead.setTitle(title);

  instance.autorun(function() {
    const limit = instance.limit.get();
    instance.subscribe("messagesByConvoId", FlowRouter.getParam("conversationId"), limit);
  });
});

Template.conversation.onRendered(function() {
  const instance = this;
  Meteor.setTimeout(function() {
    instance.$("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
    Meteor.call("conversation.markAsRead", FlowRouter.getParam("conversationId"));
  }, 900);

  $("#chatbox").bind("scroll", function() {
    // add more message
    if ($("#chatbox").scrollTop() < 100) {
      //console.log("load more message");
      const limit = instance.limit.get() + 10;
      instance.limit.set(limit);
    }
  });

  const conversationId = FlowRouter.getParam("conversationId");
  // this is for preventing auto-scrolling.
  const cursor = Messages.find({ conversation_id: conversationId }, { sort: { sent: 1 } });
  cursor.observe({
    addedAt(document, atIndex, before) {
      if (atIndex == instance.limit.get() - 1) {
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
        //console.log("if ", atIndex, " ", instance.limit.get());
      } else {
        //console.log("else ", atIndex, " ", instance.limit.get());
      }
    }
  });
});
Template.conversation.helpers({
  messages() {
    //"round" all the createdAt dates to the minute (using _.map)
    //group all messages by createdAt (using _.groupBy)
    //remove the createdAt property for all but the first item (using _.each on the list of groups, then _.map again on the grouped-together messages, the latter removing the property when the index > 0)
    //then flatten that out into an array again (using _.values, then _.flatten)
    //return it as the model for the template to work on

    const messages = _.chain(
      Messages.find({ conversation_id: FlowRouter.getParam("conversationId") }, { sort: { sent: 1 } }).fetch()
    )
      .map(m => {
        m.from_now = moment(m.sent)
          .startOf("minute")
          .fromNow();
        return m;
      })
      .groupBy("from_now")
      .forEach((i, key) => {
        return _.map(i, (m, key) => {
          if (key > 0) {
            delete m["sent"];
          }
          return m;
        });
      })
      .values()
      .flatten()
      .value();

    //console.log(messages);

    return messages;
    // return Messages.find({conversation_id: FlowRouter.getParam('conversationId')}, {sort: {sent: 1}});
  },
  conversation() {
    return Conversations.findOne({ _id: FlowRouter.getParam("conversationId") });
  }
});

Template.conversation.events({
  "click i.submit"(event, template) {
    if (
      $("#message-body")
        .val()
        .trim() != ""
    ) {
      event.preventDefault();
      const target = event.currentTarget;
      $(event.target).submit();
    }
  },
  "keypress form.sendMessage"(event, template) {
    if (
      event.which === 13 &&
      !event.shiftKey &&
      $("#message-body")
        .val()
        .trim() != ""
    ) {
      event.preventDefault();
      const target = event.currentTarget;
      $(event.target).submit();
    }
  },
  "submit .sendMessage"(event, template) {
    event.preventDefault();
    const body = $("#message-body").val();
    const body_delta = $("#message-body")
      .val()
      .replace(/\r?\n/g, "<br />");
    const data = {
      conversationId: FlowRouter.getParam("conversationId"),
      body: body,
      body_delta: body_delta
    };

    Meteor.call("message.add", data, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        Meteor.setTimeout(function() {
          $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
        }, 200);
        $("#message-body").val("");
      }
    });
  }
});
