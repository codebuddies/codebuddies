##FAQ
1. How do I start up the app?
```meteor --settings settings-development.json```

## The first 6 steps to take if you want to contribute to this open-sourced project:
1. Add your name on the google doc [bit.ly/codebuddies-hangouts-platform-v2-googledoc](http://bit.ly/codebuddies-hangouts-platform-v2-googledoc) if your name is not listed, and you want to be recognized as a collaborator.
2. Say hello on the [#codebuddies-meta channel in the Slack](https://codebuddiesmeet.slack.com/messages/codebuddies-meta/). One of us will add you as a collaborator to the repo, so that you'll be able to commit and push/pull to the app! You can also ask `@linda` for a code walkthrough of the app.
3. [Install Meteor](https://www.meteor.com/install) and Node: [docs.npmjs.com/cli/install](https://docs.npmjs.com/cli/install) if you don't already have them installed.
4a. Please star this repository! We need to reach 100 stars so that we can apply to the [Open Collective](https://opencollective.com/opensource/apply).
4b. Fork this repository! Once you have a copy of this repo on your own account, clone this repo to your computer by typing in something like:
  `git clone https://github.com/codebuddiesdotorg/cb-v2-scratch.git`
(Replace the URL with your own repository URL path.)
5. Type `meteor --settings settings-development.json` in your terminal to start up the app in your browser (`localhost:3000`). (`npm run meteor:dev` can also run the app, but will likely [use up your CPU](https://github.com/meteor/meteor/issues/4314).)
6. Look at some of the [open issues](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues) and identify one that sparks your interest. If you have any questions about it, you can leave a comment in there, or ask in the [#codebuddies-meta Slack channel](https://codebuddiesmeet.slack.com/messages/codebuddies-meta). Read below for more instructions about how to work with branches.
7. Type `git branch -a` to see a list of all the branches besides `master`, the default branch you're in. Note that if you want to switch to a branch returned in the last, you would type `git checkout BRANCHNAME`. You can read more about how to create a new branch to work on an issue below.

If you see a bug in the app or have a feature request, feel free to [create a new issue](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/new) on the Github repo!

### I've picked out an issue I want to work on and left a comment on the issue to tell everyone that I'm working on it. Now what?

- To work on a new feature, you need to *create* a new branch for the issue. You can do it by typing:

  `git checkout -b NAME_OF_NEW_BRANCH`

So for example, if you wanted to work on issue #29 [github.com/codebuddiesdotorg/cb-v2-scratch/issues/29](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/29), you should type:

  `git checkout -b fix/issue-29-limit-140-characters`

![screenshot of typing git checkout -b fix/issue-29-limit-140-characters](http://codebuddies.org/images/contributing-screenshot2.jpg)

How you name your branch doesn't really matter as long as you put the issue number in there, so that other people can figure out what you're working on. Putting the number of the issue in your branch name helps prevent duplicate branches.

All right. After we've created our branch, the next step is to push our new branch to the repo by typing:

  `git push origin NAME_OF_NEW_BRANCH`

Now we can make commits to our branch (`git commit -am "commit message"`) and `git pull` to get other people's changes to the branch, and `git push` our own commits to the branch.

Finally, when you're finished working on the fix or feature in your branch, you'll need to submit a pull request!

Click on the "pull request" button by going to https://github.com/codebuddiesdotorg/cb-v2-scratch/pulls and clicking on "new pull request." Next, select your branch, and submit.

One of the github maintainers (@linda or someone else) will look over your pull request and accept it.

### What should I remember while I'm working on my branch?

- As you're working, it's always a good idea to check which branch you're in by typing `git branch`. When you first `git clone` the repo, you'll only see a single branch, but you can discover other branches you can check out by typing `git branch -a`.

For example, to check out the `feature/active-users` branch, you would type `git checkout feature/active-users` in your command line.

#####Our staging site is located at [http://cbv2-staging.herokuapp.com](http://cbv2-staging.herokuapp.com/).

While you're working, you should try to merge in the latest from `master` occasionally while you are in your branch. You can do this by typing:

`git merge master`.

Again, type this while you are in your branch.

### What do I do when I'm ready to merge my fix or feature back into the main app?
When you are ready to merge your branch back into the main app, type `git checkout master`, `git pull`, and then `git merge BRANCHNAME`.

@anbuselvan is working on integrating javascript; automated testing will be available soon in the `dev/testing` branch.

### What are merge conflicts, and how do I resolve them?
Merge conflicts come up when there is a conflict between code that you've written and code that other people have `git push`ed into your branch.

Conflicts might also come up when you type `git merge staging` to merge in the changes from staging into your branch.

If you see a conflict, don't panic!

If you are unfamiliar with how to resolve a merge conflict in git, you should read this: [https://githowto.com/resolving_conflicts](https://githowto.com/resolving_conflicts).

In summary, the steps are:

1. open up the file(s) with the conflict.

2. Be sure to remove all traces of >>>>> , ======, and <<<<<< from the file.

3. If you're unsure about a merge conflict, or would like to pair to solve it with someone else, ask in the #codebuddies-meta channel on Slack.

4. Save the file after you've cleared up the conflict.

5. `git add [filename]`.

6. `git commit -m "message" [filename]`.

7. You're done! Now you can continue to `git push` and `git pull` and `git merge staging` while you're inside your branch.

##How do I start up the app locally and log in as an admin?
1. add your email and username to ```settings-development.json```.
2. ```meteor reset && meteor --settings settings-development.json```.
3. you will receive your password in your email .
4. admin login ```http://localhost:3000/admin```.


##Reminders:
1. Remember, you can always check which branch you are in by typing `git branch` or `git branch -a` to see all the branches that exist.

2. Remember to `git pull` occasionally to get the new commits and branches others have pushed up.

3. To minimize large messes of merge conflicts, you can `git merge master` occasionally if you're working inside a branch that you intend to merge back into `master`. Make sure you're in this branch when you type `git merge master`.

4. Type `npm run meteor:dev` to run this app. Your terminal will tell you to open up a new browser window at http://localhost:3000.

5. Remember to leave a comment on the issue if you decide to start working on an issue, so that others know.

6. Remember to join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss updates to this project and to ask questions. We'll be there!
