Template.allStudyGroups.onCreated(function() {
  const title = "CodeBuddies | Study Groups";
  const metaInfo = {
    name: "description",
    content:
      "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  let instance = this;
  instance.limit = new ReactiveVar(30);
  instance.flag = new ReactiveVar(false);
  instance.studyGroupsFilter = new ReactiveVar("new");

  instance.autorun(function() {
    let limit = instance.limit.get();
    let studyGroupsFilter = instance.studyGroupsFilter.get();
    instance.subscribe("allStudyGroups", limit, studyGroupsFilter);

    const hangoutIds = StudyGroups.find({}, { fields: { _id: 1 } }).map(
      x => `cb${x._id}`
    );
    instance.subscribe("allHangoutParticipants", hangoutIds);
  });

  instance.loadStudyGroups = function(flag = 1) {
    return StudyGroups.find({}, { sort: { createdAt: flag } });
  };

  instance.addMoreStudyGroups = function() {
    if (StudyGroups.find().count() == instance.limit.get()) {
      instance.limit.set(instance.limit.get() + 9);
    } else {
      if (StudyGroups.find().count() < instance.limit.get()) {
        instance.flag.set(true);
      }
    }
  };
});

Template.allStudyGroups.helpers({
  studyGroups: function() {
    return Template.instance().loadStudyGroups();
  },
  status: function() {
    return Template.instance().flag.get();
  },
  studyGroupsFilter: function() {
    console.log(Template.instance().studyGroupsFilter.get());
    return Template.instance().studyGroupsFilter.get();
  },
  sgSearchMode: function() {
    return Session.get("sgSearchMode");
  },
  numParticipants: function(studyGroupId) {
    const hangoutId = `cb${studyGroupId}`;
    const appState = AppStats.findOne({ _id: hangoutId });
    if (appState && appState.participants) {
      return appState.participants.length;
    }
    return 0;
  },
  getUpdatedAtTime: function(updatedAt) {
    let returnTime = null;
    let timeNow = new Date().getTime();
    let lastUpdateTime = updatedAt.getTime();
    const diffInSeconds = Math.round((timeNow - lastUpdateTime) / 1000);
    const diffInMins = Math.round((timeNow - lastUpdateTime) / (1000 * 60));
    const diffInHours = Math.round((timeNow - lastUpdateTime) / (1000 * 3600));
    const diffInDays = Math.round(
      (timeNow - lastUpdateTime) / (1000 * 3600 * 24)
    );

    if (diffInDays) {
      returnTime = `${diffInDays} ${diffInDays > 1 ? "days" : "day"} ago`;
    } else if (diffInHours) {
      returnTime = `${diffInHours} ${diffInHours > 1 ? "hours" : "hour"} ago`;
    } else if (diffInMins) {
      returnTime = `${diffInMins} ${diffInMins > 1 ? "minutes" : "minute"} ago`;
    } else {
      returnTime = `${diffInSeconds} ${
        diffInSeconds > 1 ? "seconds" : "second"
      } ago`;
    }

    return returnTime;
  }
});

Template.allStudyGroups.events({
  "change #studyGroupsFilter": function(event, template) {
    studyGroupsFilter = template.find("#studyGroupsFilter").value;
    template.flag.set(false);
    template.studyGroupsFilter.set(studyGroupsFilter);
  },
  "click #createGroupButton": function(event) {
    Modal.show("newStudyGroupModal");
  },
  "click .btn-leave-study-group": function(event, template) {
    event.preventDefault();
    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    };

    Meteor.call("leaveStudyGroup", data, function(error, result) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        return Bert.alert(
          "You have left the study group!",
          "success",
          "growl-top-right"
        );
      }
    });
  },
  "click .btn-join-study-group": function(event, template) {
    event.preventDefault();
    if (Meteor.userId()) {
      let data = {
        studyGroupId: this._id,
        studyGroupTitle: this.title,
        studyGroupSlug: this.slug
      };

      Meteor.call("joinStudyGroup", data, function(error, result) {
        if (error) {
          return Bert.alert(error.reason, "danger", "growl-top-right");
        }
        if (result) {
          return Bert.alert(
            "You have joined the study group!",
            "success",
            "growl-top-right"
          );
        }
      });
    }
  },
  "click #loadMoreStudyGroups": function(event, template) {
    template.addMoreStudyGroups();
  }
});
