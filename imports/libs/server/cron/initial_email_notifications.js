import { CBMailer } from "/imports/libs/server/cb_mailer/";
import { Meteor } from "meteor/meteor";
import _ from "lodash";
import moment from "moment";
import {
  getEligibleRecipients,
  getGroupMembers,
  getGroupOrganizers,
  getDiscussionSubscribers,
  getNewHangouts,
  getNewDiscussions,
  getNewDiscussionResponses,
  getNewMembers,
  createdFromNow,
  generateUnsubscribeLink,
  getNewConversations,
  getNewMessages
} from "./helpers";

/**
 * send email notification for new hangouts to eligible recipients
 * @function
 * @name initialEmailNotificationsForHangouts
 */
async function initialEmailNotificationsForHangouts() {
  let hangouts = await getNewHangouts();
  if (hangouts && hangouts.length) {
    const hangoutsByGroup = await _.groupBy(hangouts, "group.id");

    for (const studyGroupId in hangoutsByGroup) {
      if (hangoutsByGroup.hasOwnProperty(studyGroupId)) {
        // hangout by group
        let listOfNewHangouts = hangoutsByGroup[studyGroupId];

        //add from_now
        listOfNewHangouts = listOfNewHangouts.map(function(hangout) {
          hangout.from_now = moment(hangout.start).fromNow();
          return hangout;
        });

        // get list of group members
        const recipients = await getGroupMembers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible recipients
          const eligible_recipients = await getEligibleRecipients("new_hangout", recipients);

          if (eligible_recipients) {
            eligible_recipients.forEach(recipient => {
              const mail_data = {
                to: recipient,
                from: Meteor.settings.email_from,
                subject: `${listOfNewHangouts[0].group.title} New Hangouts`
              };

              // private/email/new_hangout.html
              const template_name = "new_hangout";

              const template_data = {
                hangouts: listOfNewHangouts,
                group: listOfNewHangouts[0].group,
                base_url: Meteor.absoluteUrl(),
                unsubscribe_link: generateUnsubscribeLink(recipient, template_name)
              };

              CBMailer(mail_data, template_name, template_data);
            });

            // set intial flag for email_notifications true
            listOfNewHangouts.forEach(function(hangout) {
              Hangouts.update(
                { _id: hangout._id },
                {
                  $set: {
                    "email_notifications.initial": true
                  }
                }
              );
            });
          } // endif eligible_recipients
        } //endif recipients
      }
    } // end for
  }
}

async function initialEmailNotificationsForDiscussions() {
  let discussions = await getNewDiscussions();

  if (discussions && discussions.length) {
    // group by studygroups
    const discussionsByGroup = await _.groupBy(discussions, "study_group.id");

    for (const studyGroupId in discussionsByGroup) {
      if (discussionsByGroup.hasOwnProperty(studyGroupId)) {
        // hangout by group
        let listOfDiscussions = discussionsByGroup[studyGroupId];
        // add from_now
        listOfDiscussions = listOfDiscussions.map(createdFromNow);
        // get list of members for the group.
        const recipients = await getGroupMembers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible receive
          const eligible_recipients = await getEligibleRecipients("new_discussion", recipients);

          if (eligible_recipients) {
            eligible_recipients.forEach(recipient => {
              const mail_data = {
                to: recipient,
                from: Meteor.settings.email_from,
                subject: `${listOfDiscussions[0].study_group.title} New Discussions`
              };

              // private/email/new_discussion.html
              const template_name = "new_discussion";

              const template_data = {
                discussions: listOfDiscussions,
                group: listOfDiscussions[0].study_group,
                base_url: Meteor.absoluteUrl(),
                unsubscribe_link: generateUnsubscribeLink(recipient, template_name)
              };

              CBMailer(mail_data, template_name, template_data);
            });

            // set intial flag for email_notifications true
            listOfDiscussions.forEach(function(discussion) {
              Discussions.update(
                { _id: discussion._id },
                {
                  $set: {
                    "email_notifications.initial": true
                  }
                }
              );
            });
          } // endif eligible_recipients
        } //endif recipients
      }
    } // end for
  }
}

async function initialEmailNotificationsForResponses() {
  const discussionResponses = await getNewDiscussionResponses();

  if (discussionResponses && discussionResponses.length) {
    const responsesByDiscussion = await _.groupBy(discussionResponses, "discussion_id");
    for (const discussionId in responsesByDiscussion) {
      if (responsesByDiscussion.hasOwnProperty(discussionId)) {
        let listOfResponses = responsesByDiscussion[discussionId];

        listOfResponses = listOfResponses.map(createdFromNow);

        let recipients = await getDiscussionSubscribers(discussionId);

        if (recipients && recipients.length) {
          recipients.forEach(recipient => {
            const discussion = Discussions.findOne({ _id: discussionId });

            const mail_data = {
              to: recipient,
              from: Meteor.settings.email_from,
              subject: `${discussion.topic}`
            };

            // private/email/new_discussion_response.html
            const template_name = "new_discussion_response";

            const template_data = {
              discussion: discussion,
              discussionResponses: listOfResponses,
              base_url: Meteor.absoluteUrl(),
              unsubscribe_link: generateUnsubscribeLink(recipient, template_name, discussionId, discussion.topic)
            };

            CBMailer(mail_data, template_name, template_data);
          });

          // set intial flag for email_notifications true
          listOfResponses.forEach(function(responses) {
            DiscussionResponses.update(
              { _id: responses._id },
              {
                $set: {
                  "email_notifications.initial": true
                }
              }
            );
          });
        }
      }
    }
  } //endif discussionResponses
}

async function initialEmailNotificationsForNewMembers() {
  const activities = await getNewMembers();

  if (activities && activities.length) {
    const activitiesByGroup = await _.groupBy(activities, "study_group.id");

    for (const studyGroupId in activitiesByGroup) {
      if (activitiesByGroup.hasOwnProperty(studyGroupId)) {
        // activities by group
        let listOfActivities = activitiesByGroup[studyGroupId];

        listOfActivities = listOfActivities.map(createdFromNow);

        // get list of organizers for the group.
        let recipients = await getGroupOrganizers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible recipients
          const eligible_recipients = await getEligibleRecipients("new_member", recipients);

          if (eligible_recipients) {
            eligible_recipients.forEach(recipient => {
              const mail_data = {
                to: recipient,
                from: Meteor.settings.email_from,
                subject: `${listOfActivities[0].study_group.title} New Members`
              };

              // private/email/new_member.html
              const template_name = "new_member";

              const template_data = {
                activities: listOfActivities,
                group: listOfActivities[0].study_group,
                base_url: Meteor.absoluteUrl(),
                unsubscribe_link: generateUnsubscribeLink(recipient, template_name)
              };

              CBMailer(mail_data, template_name, template_data);
            });

            // set intial flag for email_notifications true
            listOfActivities.forEach(function(activity) {
              Activities.update(
                { _id: activity._id },
                {
                  $set: {
                    "email_notifications.initial": true
                  }
                }
              );
            });
          } // endif eligible_recipients
        } //endif recipients
      }
    } // end for
  }
}

async function initialEmailNotificationsForNewMessages() {
  // get new conversations
  const conversations = await getNewConversations();

  if (conversations && conversations.length) {
    for (const key in conversations) {
      const { _id: conversationId, read_by, participants, last_seen } = conversations[key];

      // check if all the participants has
      // read the conversation or not.
      if (read_by.length < participants.length) {
        // email recipients = participants - read_by
        const recipients = participants.filter(p => {
          return read_by.indexOf(p.id) == -1;
        });

        if (recipients.length) {
          // check for new messages
          for (const key in recipients) {
            const recipient = recipients[key];

            let messages = await getNewMessages(conversationId, recipient, last_seen);

            messages = _.chain(messages)
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

            if (messages && messages.length) {
              const eligible_recipients = await getEligibleRecipients("new_direct_message", recipients);

              if (eligible_recipients) {
                eligible_recipients.forEach(recipient => {
                  const mail_data = {
                    to: recipient,
                    from: Meteor.settings.email_from,
                    subject: `New Message from ${messages[0].from.username}`
                  };

                  // private/email/new_member.html
                  const template_name = "new_direct_message";

                  const template_data = {
                    messages: messages,
                    base_url: Meteor.absoluteUrl(),
                    unsubscribe_link: generateUnsubscribeLink(recipient, template_name)
                  };

                  CBMailer(mail_data, template_name, template_data);
                });
              } // endif eligible_recipients
            } // end messages
          }
        }
      }

      // set intial flag for email_notifications true
      Conversations.update(
        { _id: conversationId },
        {
          $set: {
            "email_notifications.initial": true
          }
        }
      );
    } //for conversation
  }
}

async function initialEmailNotifications() {
  await initialEmailNotificationsForHangouts();
  await initialEmailNotificationsForDiscussions();
  await initialEmailNotificationsForNewMembers();
  await initialEmailNotificationsForResponses();
  await initialEmailNotificationsForNewMessages();
}

export { initialEmailNotifications };
