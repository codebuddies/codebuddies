## How to contribute as a collaborator on this codebase:
- Add your name on the google doc [http://bit.ly/codebuddies-hangouts-platform-v2-googledoc](http://bit.ly/codebuddies-hangouts-platform-v2-googledoc) if your name is not listed, and you want to be added as a collaborator. 
- Say hello on the [#codebuddies-meta channel in the Slack](https://codebuddiesmeet.slack.com/messages/codebuddies-meta/)
-  [Install Meteor](https://www.meteor.com/install)
-  Clone this repo to your computer by typing in the command line:

  `git clone https://github.com/codebuddiesdotorg/cb-v2-scratch.git`
- Look at some of the [open issues](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues) and pick one to work on.
- To work on a new feature, create a new branch to work on and switch to that branch by typing:

  `git checkout -b [name_of_your_new_branch]`

- Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `feature/hangout-now` would be a branch for creating the hangout "now" feature.

- Push your new branch to the repo by typing:

  `git push origin [name_of_your_new_branch]`

- Type `git checkout [branchname]` to work on one of the existing branches. You can type `git branch -a` to see the list of all local and remote branches. For example, to check out the `feature/active-users` branch, you would type `git checkout feature/active-users` in your command line.

A note on merge conflicts: occasionally you'll want to merge the latest from master into your branch by typing `git merge master` while you are in the branch. Sometimes when you do so, you'll run into merge conflicts. To resolve a merge conflict, edit the file in the code (getting rid of the `>>>> HEAD` and `======` and `<<<<<MASTER` lines, save it, type `git add [filename where the merge conflict occurred]`, and then `git commit`. At this point you'll be in the VIM editor. Hit the `escape` key on your keyboard and then type `:wq` and `enter` on your keyboard to succcesfully conclude the merge conflict.)

To merge a branch back into `master`, type `git merge [name_of_branch]` while you are in the `master` branch.

Remember, you can always check which branch you are in by typing `git branch`. 

- Remember to `git pull` occasionally to get the new commits and branches others have pushed up.

- Remember to `git merge master` occasionally if you're working inside a branch that you intend to merge back into master. Make sure you're in this branch when you type `git merge master`. 

- Type `meteor` to run this app. Your terminal will tell you to open up a new browser window and go to http://localhost:3000. 

- Browse through the list of issues to see what features are up for grabs. If you decide to start working on an issue, add a comment to that issue thread. 

- Remember to join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [http://codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss updates to this project and to ask questions.


##Mockup of what we're building (designed by @adachiu):
![very rough mockup of hangouts v2.0](https://files.slack.com/files-pri/T04AQ6GEY-F0LGNGMED/screen_shot_2016-02-07_at_12.46.48_pm.jpg)
