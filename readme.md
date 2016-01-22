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

Add your name on the google doc (http://bit.ly/codebuddies-hangouts-platform-v2-googledoc)[http://bit.ly/codebuddies-hangouts-platform-v2-googledoc] if your name is not listed, and you want to be added as a collaborator. 


##What is CodeBuddies?
We're an international community of independent code learners who support each other on Slack, schedule hangouts to learn with each other at http://hangouts.codebuddies.org, and contribute to an anonymous weekly shout-out newsletter at http://codebuddies.org/weekly. Learning with each other helps us learn faster. We’ve also teamed up with The Odin Project member volunteers on a Facebook group: https://www.facebook.com/groups/TOPSTUDYGROUP/. We strive to create a safe space for anyone interested in code to talk about the learning process. The project is free and open-sourced on Github.

##Is CodeBuddies an organization?
No. It's a free-spirited community of enterprising learners and amazing volunteers who enjoy sharing knowledge with each other. 

##What are you trying to build here?
P1 == Priority 1
P2 == Priority 2
P3 == Priority 3

CodeBuddies Hangouts Platform v2.0 will be built using meteor and will feature:
- P1: ability to see who else is online when you load the frontpage (or hangout-page)
- P1: a spot for every person to fill in a “current status” to describe what they’re “currently working on”. This way, you’ll be able to see at a glance what everyone is working on.
- P1: create a new (google?) hangout with a click of a button. 
- P2: ability to schedule start and end times for future hangouts (existing feature on hangouts.codebuddies.org)
- P1: ability to start a hangout “NOW” and not have to specify an end time
- P3: ability to see the # of people who’ve already joined each hangout. 
- P1: an explanation of the types of hangouts one can create:
silent hangout / general study motivation hangout where video + mic is muted teaching hangout (hangout creator will be someone who wants to teach)
talk through a chapter of a dense programming book or article
pair program on a set of coding exercises
work on TUTORIAL X at the same time and ask each other questions if they come up (mostly silent, but everyone working on the same material)
Project (Like codequarters)
- P1: an embed of the slackin widget to let people sign up on the codebuddiesmeet slack
an explanation of the #100daysofcode challenge and #todayilearned hashtag (currently side projects in development by @abdulhannanali and @linda… if you guys want to help let us know in #codebuddies-meta!)
an explanation of how to use Slack -- e.g. recommend downloading the slack app so one can join other Slack communities as well without having to switch, short explanation of the 88 channels, highlights of some channels such as #
- P1: An “about” page (or section of the home page?) explaining what the community is about, and some of the top contributors here -- i.e. people who’ve made pull requests, are volunteer moderators on the Slack, have lots of /prowd points, etc. 


## How to contribute as a collaborator on this codebase:

-  Install Meteor.
-  `git clone` this repo.
-  `git checkout [branchname]` to work on one of the branches. You can type `git branch` to see the list of available branches. For example, to check out the `active-users` branch, type `git checkout active-users` in your command line. If you need to create a new branch to work on a feature, type `git checkout -b [name_of_your_new_branch]` and `git push origin [name_of_your_new_branch]`.

A note on merge conflicts: occasionally you'll want to merge the latest from master into your branch by typing `git merge master` while you are in the branch. Sometimes when you do so, you'll run into merge conflicts. To resolve a merge conflict, edit the file in the code (getting rid of the `>>>> HEAD` and `======` and `<<<<<MASTER` lines, save it, type `git add [filename where the merge conflict occurred]`, and then `git commit`. At this point you'll be in the VIM editor. Hit the `escape` key on your keyboard and then type `:wq` and `enter` on your keyboard to succcesfully conclude the merge conflict.)

To merge a branch back into `master`, type `git merge [name_of_branch]` while you are in the `master` branch.

Remember, you can always check which branch you are in by typing `git branch`. 

- Type `meteor` to run this app. Your terminal will tell you to open up a new browser window and go to http://localhost:3000. 

- Browse through the list of issues to see what features are up for grabs. 

- Join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [http://codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss this project and to ask any questions.


##Very rough mockup of what we're building:
![very rough mockup of hangouts v2.0](http://codebuddies.org/images/codebuddies-v2-mockup.jpg)
