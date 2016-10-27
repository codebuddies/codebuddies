##FAQ
1. How do I start up the app?
  * `meteor npm install`
  * `meteor --settings settings-development.json`

If you have any problems getting the app to start, feel free to ask in the #troubleshooting channel on the CodeBuddies Slack. (Click [here](http://codebuddiesmeet.herokuapp.com) for an invite to the Slack channel if you're not already on it.) Please mention:
- your operating system (e.g. Windows, MacOSX, Linux, etc.)
- which version of meteor you have installed (You can type `meteor --version` in your terminal to check)
- Whether or not you've run `meteor npm install` before you attempted to start the app.

## The first 6 steps to take if you want to contribute to this open-sourced project:
1. Add your name on the google doc [bit.ly/codebuddies-hangouts-platform-v2-googledoc](http://bit.ly/codebuddies-hangouts-platform-v2-googledoc) if your name is not listed, and you want to be recognized as a collaborator.
2. Say hello on the [#codebuddies-meta channel in the Slack](https://codebuddiesmeet.slack.com/messages/codebuddies-meta/). Feel free to ask questions here, or to ask for someone to review your pull request.
3. [Install Meteor](https://www.meteor.com/install) and Node: [docs.npmjs.com/cli/install](https://docs.npmjs.com/cli/install) if you don't already have them installed.
4. Please star this repository! We need to reach 100 stars so that we can apply to the [Open Collective](https://opencollective.com/opensource/apply). [Edit - We're already there!]
5. Fork this repository! Once you have a copy of this repo on your own account, clone this repo to your computer by typing in something like:
  `git clone https://github.com/codebuddiesdotorg/cb-v2-scratch.git`
(Replace the URL with your own repository URL path.)
6. Setup this repository as an upstream branch using:
`git remote add upstream https://github.com/codebuddiesdotorg/cb-v2-scratch.git`. <br/>
Now, whenever you want to sync with the owner repository. Do the following:
 * `git fetch upstream`
 * `git checkout master`
 * `git merge upstream/master`

7. Type `meteor npm install`, and then `meteor --settings settings-development.json` in your terminal to start up the app in your browser (`localhost:3000`). (`npm run meteor:dev` can also run the app, but will likely [use up your CPU](https://github.com/meteor/meteor/issues/4314).)
8. Look at some of the [open issues](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues) and identify one that sparks your interest. If you want to work on the issue, leave a comment on it saying that you're working on it!
9. If you have any questions about the issue you're looking at, you can leave a comment in there, or ask in the [#codebuddies-meta Slack channel](https://codebuddiesmeet.slack.com/messages/codebuddies-meta). Read below for more instructions about how to work with branches.
10. Type `git branch -a` to see a list of all the branches besides `master`, the default branch you're in. Note that if you want to switch to a branch returned in the last, you would type `git checkout BRANCHNAME`. You can read more about how to create a new branch to work on an issue below.

If you see a bug in the app or have a feature request, feel free to [create a new issue](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/new) on the Github repo!

### I've picked out an issue I want to work on and left a comment on the issue to tell everyone that I'm working on it. Now what?

- To work on a new feature, leave a comment on the issue saying that you're working on it. Then, you need to *create* a new branch for the issue. You can do it by typing:

  `git checkout -b NAME_OF_NEW_BRANCH`

So for example, if you wanted to work on issue #29 [github.com/codebuddiesdotorg/cb-v2-scratch/issues/29](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/29), you should type:

  `git checkout -b fix/issue-29-limit-140-characters`

Please remember to include the issue number in the name of the branch and reference you pull request.

![screenshot of typing git checkout -b fix/issue-29-limit-140-characters](http://codebuddies.org/images/contributing-screenshot2.jpg)

How you name your branch doesn't really matter as long as you put the issue number in there, so that other people can figure out what you're working on. Putting the number of the issue in your branch name helps prevent duplicate branches.

All right. After we've created our branch, the next step is to push our new branch to the repo by typing:

  `git push origin NAME_OF_NEW_BRANCH`

Now we can make commits to our branch (`git commit -am "commit message"`) and `git pull` to get other people's changes to the branch, and `git push` our own commits to the branch.

Finally, when you're finished working on the fix or feature in your branch, you'll need to submit a pull request!

Click on the "pull request" button by going to https://github.com/codebuddiesdotorg/cb-v2-scratch/pulls and clicking on "new pull request." Next, select your branch, and submit.

One of the github maintainers (@linda or someone else) will look over your pull request and accept it.

Note 1 - If you've picked out an issue to work on, make sure you let people know that you're continuing working on it, if the fix happens to take 2 days or longer. An update every two dates by way of a comment on the issue will do. Doesn't necessarily have to be a fix. In case you're unable to continue on the issue for some reason, just let people know that as well so that someone else can claim it. If you do not update within a couple of days, it will be assumed that the issue is not being attended to and will be up for grabs.

Note 2 - "Thou shalt not hijack a 'claimed' issue so long as the person who's claimed it has commented otherwise or one of the maintainers has added the unclaimed label onto it."

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

Note: When you create a hangout in localhost:3000, a Slack notification will be sent to the #cb2-test channel. This emulates what happens when you create a hangout on codebuddies.org/; a Slack announcement about the hangout will appear in the #general channel.


###How do I seed the app with fake Posts/Hangouts
When the app is run locally, there are no hangouts seeded by default. Hence to be able to see how things work out, some fake posts could be seeded to the app. To do this run the app with the following changes.

1. Open the ```settings-development.json``` file in the root directory of app.
2. Find the ```"seeder":false``` line inside the file and change it to ```"seeder":true```.
3. Now start the app normally using ```meteor --settings settings-development.json```
4. Now you can see that fake data is seeded to the app.

##Reminders:
1. Remember, you can always check which branch you are in by typing `git branch` or `git branch -a` to see all the branches that exist.

2. Remember to `git pull` occasionally to get the new commits and branches others have pushed up.

3. To minimize large messes of merge conflicts, you can `git merge master` occasionally if you're working inside a branch that you intend to merge back into `master`. Make sure you're in this branch when you type `git merge master`.

4. Type `npm run meteor:dev` to run this app. Your terminal will tell you to open up a new browser window at http://localhost:3000.

5. Remember to leave a comment on the issue if you decide to start working on an issue, so that others know.

6. Remember to join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss updates to this project and to ask questions. We'll be there!
