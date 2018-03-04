import { CBMailer } from '/imports/libs/server/cb_mailer/';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import {
  getEligibleRecipients,
  getGroupMembers,
  getGroupOrganizers,
  getDiscussionSubscribers,
  getNewHangouts,
  getNewDiscussions,
  getNewDiscussionResponses,
  getNewMembers,
  createdFromNow } from './helpers';


/**
* send email notification for new hangouts to eligible recipients
* @function
* @name initialEmailNotificationsForHangouts
*/
async function initialEmailNotificationsForHangouts() {
   let hangouts = await getNewHangouts();
   if (hangouts && hangouts.length) {

    const hangoutsByGroup = await _.groupBy(hangouts, 'group.id');

    for (const studyGroupId in hangoutsByGroup) {
      if (hangoutsByGroup.hasOwnProperty(studyGroupId)) {


        // hangout by group
        let listOfNewHangouts = hangoutsByGroup[studyGroupId];

        //add from_now
        listOfNewHangouts = listOfNewHangouts.map(function(hangout){
          hangout.from_now = moment(hangout.start).fromNow();
          return hangout
        })

        // get list of group members
        const recipients = await getGroupMembers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible recipients
          const eligible_recipients = await getEligibleRecipients('new_hangout', recipients)

          if (eligible_recipients) {

            const mail_data = {
               to: eligible_recipients,
               from: Meteor.settings.email_from,
               subject: `${listOfNewHangouts[0].group.title} New Hangouts`
             }

             // private/email/new_hangout.html
             const template_name = 'new_hangout';

             const template_data = {
               hangouts: listOfNewHangouts,
               group: listOfNewHangouts[0].group,
               base_url: Meteor.absoluteUrl()
             }

            CBMailer(mail_data, template_name, template_data);
            // set intial flag for email_notifications true
            listOfNewHangouts.forEach(function(hangout){
              Hangouts.update({_id:hangout._id}, {$set:{
                'email_notifications.initial': true
              }});
            })

          }// endif eligible_recipients
        }//endif recipients
      }
    }// end for
  }
}

async function initialEmailNotificationsForDiscussions() {

  let discussions = await getNewDiscussions();

  if (discussions && discussions.length) {
    // group by studygroups
    const discussionsByGroup = await _.groupBy(discussions, 'study_group.id');

    for (const studyGroupId in discussionsByGroup) {
      if (discussionsByGroup.hasOwnProperty(studyGroupId)) {
        // hangout by group
        let listOfDiscussions = discussionsByGroup[studyGroupId];
        // add from_now
        listOfDiscussions = listOfDiscussions.map(createdFromNow)
        // get list of members for the group.
        const recipients = await getGroupMembers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible receive
          const eligible_recipients = await getEligibleRecipients('new_discussion', recipients)

          if (eligible_recipients) {

            const mail_data = {
               to: eligible_recipients,
               from: Meteor.settings.email_from,
               subject: `${listOfDiscussions[0].study_group.title} New Discussions`
             }

             // private/email/new_discussion.html
             const template_name = 'new_discussion';

             const template_data = {
               discussions: listOfDiscussions,
               group: listOfDiscussions[0].study_group,
               base_url: Meteor.absoluteUrl()
             }

            CBMailer(mail_data, template_name, template_data);

            // set intial flag for email_notifications true
            listOfDiscussions.forEach(function(discussion){
              Discussions.update({_id:discussion._id}, {$set:{
                'email_notifications.initial': true
              }});
            })

          }// endif eligible_recipients
        }//endif recipients
      }
    }// end for
  }
}

async function initialEmailNotificationsForResponses() {

  const discussionResponses = await getNewDiscussionResponses();

  if (discussionResponses && discussionResponses.length) {
    const responsesByDiscussion = await _.groupBy(discussionResponses, 'discussion_id');
    for (const discussionId in responsesByDiscussion) {
      if (responsesByDiscussion.hasOwnProperty(discussionId)) {

        let listOfResponses= responsesByDiscussion[discussionId];

        listOfResponses = listOfResponses.map(createdFromNow);

        let recipients = await getDiscussionSubscribers(discussionId);

        if (recipients && recipients.length) {

          const discussion = Discussions.findOne({_id:discussionId});

          const mail_data = {
            to: recipients,
            from: Meteor.settings.email_from,
            subject: `${discussion.topic}`
          }

          // private/email/new_discussion_response.html
          const template_name = 'new_discussion_response';

          const template_data = {
            discussion: discussion,
            discussionResponses: listOfResponses,
            base_url: Meteor.absoluteUrl()
          }

          CBMailer(mail_data, template_name, template_data);

          // set intial flag for email_notifications true
          listOfResponses.forEach(function(responses){
           DiscussionResponses.update({_id:responses._id}, {$set:{
             'email_notifications.initial': true
           }});
          })
        }
      }
    }
  }//endif discussionResponses
}

async function initialEmailNotificationsForNewMembers() {
  const activities = await getNewMembers();

  if (activities && activities.length) {

    const activitiesByGroup = await _.groupBy(activities, 'study_group.id');

    for (const studyGroupId in activitiesByGroup) {
      if (activitiesByGroup.hasOwnProperty(studyGroupId)) {

        // activities by group
        let listOfActivities= activitiesByGroup[studyGroupId];

        listOfActivities = listOfActivities.map(createdFromNow)

        // get list of organizers for the group.
        let recipients = await getGroupOrganizers(studyGroupId);

        if (recipients && recipients.length) {
          // get eligible recipients
          const eligible_recipients = await getEligibleRecipients('new_member', recipients)

          if (eligible_recipients) {

            const mail_data = {
               to: eligible_recipients,
               from: Meteor.settings.email_from,
               subject: `${listOfActivities[0].study_group.title} New Members`
             }

             // private/email/new_member.html
             const template_name = 'new_member';

             const template_data = {
               activities: listOfActivities,
               group: listOfActivities[0].study_group,
               base_url: Meteor.absoluteUrl()
             }

             CBMailer(mail_data, template_name, template_data);

             // set intial flag for email_notifications true
             listOfActivities.forEach(function(activity){
               Activities.update({_id:activity._id}, {$set:{
                 'email_notifications.initial': true
               }});
             })

           }// endif eligible_recipients
        }//endif recipients
      }
    }// end for
  }
}

function initialEmailNotifications() {
  initialEmailNotificationsForHangouts();
  initialEmailNotificationsForDiscussions();
  initialEmailNotificationsForNewMembers();
  initialEmailNotificationsForResponses();
}

export {
  initialEmailNotifications
}
