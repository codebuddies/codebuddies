[![Stories in Ready](https://badge.waffle.io/codebuddiesdotorg/cb-v2-scratch.png?label=ready&title=Ready)](https://waffle.io/codebuddiesdotorg/cb-v2-scratch)
#CodeBuddies Hangouts Platform v2.0 - from scratch

#FAQ
##Who are the volunteers helping with this project?
List your codebuddiesmeet Slack handle and your github username below if you’d like to be involved.
- @linda, https://github.com/lpatmo 
- @sbe, https://github.com/sbe 
- @abdulhannanali, https://github.com/abdulhannanali 
- @bethanyg, https://github.com/bethanyg 
- @mattierae https://github.com/mattierae 
- @adachiu https://github.com/adachiu 
- @wuworkshop https://github.com/wuworkshop
- @Richardh https://github.com/studentrik
- @anbuselvan https://github.com/anbuselvan
- @husam https://github.com/hudat
- @ccr https://github.com/Iccr
- @ghazi https://github.com/ghmoha
- @mualth https://github.com/maudem
- @oliver84 https://github.com/Oliver84
- Your Name Here

Add your name on the google doc [http://bit.ly/codebuddies-hangouts-platform-v2-googledoc](http://bit.ly/codebuddies-hangouts-platform-v2-googledoc) if your name is not listed, and you want to be added as a collaborator. 


##What is CodeBuddies?
We're an international community of independent code learners who support each other on Slack, schedule hangouts to learn with each other at http://hangouts.codebuddies.org, and contribute to an anonymous weekly shout-out newsletter at http://codebuddies.org/weekly. Learning with each other helps us learn faster. We’ve also teamed up with The Odin Project member volunteers on a Facebook group: https://www.facebook.com/groups/TOPSTUDYGROUP/. We strive to create a safe space for anyone interested in code to talk about the learning process. The project is free and open-sourced on Github.

##Is CodeBuddies an organization?
No. It's a free-spirited community of enterprising learners and amazing volunteers who enjoy sharing knowledge with each other. 

##What are you trying to build here?
P1 == Priority 1
P2 == Priority 2
P3 == Priority 3

CodeBuddies Hangouts Platform v2.0 will be built using meteor and will feature:

### P1 Issues
- [issue 5] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/5) - ability to see who else is online when you load the frontpage (or hangout-page)
- [issue 6] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/6) - a spot for every person to fill in a “current status” to describe what they’re “currently working on”. This way, you’ll be able to see at a glance what everyone is working on.
- [issue 7] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/7) - create a new (google?) hangout with a click of a button.
- [issue 8] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/8) - ability to start a hangout “NOW” and not have to specify an end time
- [issue 10] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/10) - an explanation of the types of hangouts one can create:
silent hangout / general study motivation hangout where video + mic is muted teaching hangout (hangout creator will be someone who wants to teach)
talk through a chapter of a dense programming book or article
pair program on a set of coding exercises
work on TUTORIAL X at the same time and ask each other questions if they come up (mostly silent, but everyone working on the same material)
Project (Like codequarters)
- [issue 11] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/11) - an embed of the slackin widget to let people sign up on the codebuddiesmeet slack
- [issue 13] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/13) - an explanation of the #100daysofcode challenge and #todayilearned hashtag (currently side projects in development by @abdulhannanali and @linda… if you guys want to help let us know in #codebuddies-meta!)
- [issue 14] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/14) - an explanation of how to use Slack -- e.g. recommend downloading the slack app so one can join other Slack communities as well without having to switch, short explanation of the 88 channels, highlights of some channels such as
- [issue 12] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/12) - An “about” page (or section of the home page?) explaining what the community is about, and some of the top contributors here -- i.e. people who’ve made pull requests, are volunteer moderators on the Slack, have lots of /prowd points, etc.

### P2 Issues
- [issue 15] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/15) - ability to schedule start and end times for future hangouts (existing feature on hangouts.codebuddies.org)

### P3 Issues
- [issue 9] (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/9) - ability to see the # of people who’ve already joined each hangout.


## How to contribute as a collaborator on this codebase:

-  [Install Meteor](https://www.meteor.com/install)
-  Clone this repo to your computer by typing in the command line:

  `git clone https://github.com/codebuddiesdotorg/cb-v2-scratch.git`

- To work on a new feature, create a new branch to work on and switch to that branch by typing:

  `git checkout -b [name_of_your_new_branch]`

- Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `feature/hangout-now` would be a branch for creating the hangout "now" feature.

- Push your new branch to the repo by typing:

  `git push origin [name_of_your_new_branch]`

- Type `git checkout [branchname]` to work on one of the existing branches. You can type `git branch -a` to see the list of all local and remote branches. For example, to check out the `feature/active-users` branch, you would type `git checkout feature/active-users` in your command line.

A note on merge conflicts: occasionally you'll want to merge the latest from master into your branch by typing `git merge master` while you are in the branch. Sometimes when you do so, you'll run into merge conflicts. To resolve a merge conflict, edit the file in the code (getting rid of the `>>>> HEAD` and `======` and `<<<<<MASTER` lines, save it, type `git add [filename where the merge conflict occurred]`, and then `git commit`. At this point you'll be in the VIM editor. Hit the `escape` key on your keyboard and then type `:wq` and `enter` on your keyboard to succcesfully conclude the merge conflict.)

To merge a branch back into `master`, type `git merge [name_of_branch]` while you are in the `master` branch.

Remember, you can always check which branch you are in by typing `git branch`. 

- Type `meteor` to run this app. Your terminal will tell you to open up a new browser window and go to http://localhost:3000. 

- Browse through the list of issues to see what features are up for grabs. 

- Join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [http://codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss this project and to ask any questions.


##Very rough mockup of what we're building:
![very rough mockup of hangouts v2.0](http://codebuddies.org/images/codebuddies-v2-mockup.jpg)
