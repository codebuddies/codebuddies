# Table of Contents
1. [Quick Steps on Contributing](#the-quick-steps-on-contributing)
2. [More Detailed Steps on Contributing](#the-more-detailed-steps-on-contributing)
3. [Common Questions](#common-questions)
  1. [How do I start up the app?](#how-do-i-start-up-the-app)
  2. [I've picked out an issue I want to work on and left a comment on the issue to tell everyone that I'm working on it. Now what?](#ive-picked-out-an-issue-i-want-to-work-on-and-left-a-comment-on-the-issue-to-tell-everyone-that-im-working-on-it-now-what)
  3. [What should I remember while I'm working on my branch?](#what-should-i-remember-while-im-working-on-my-branch)
  4. [How do I stage master/deploy?](#how-do-i-stage-masterdeploy)
  4. [What do I do when I'm ready to merge my fix or feature back into the main app?](#what-do-i-do-when-im-ready-to-merge-my-fix-or-feature-back-into-the-main-app)
  5. [What are merge conflicts, and how do I resolve them?](#what-are-merge-conflicts-and-how-do-i-resolve-them)
  6. [How do I start up the app locally and log in as an admin?](#how-do-i-start-up-the-app-locally-and-log-in-as-an-admin)
  7. [How do I seed the app with fake Posts/Hangouts?](#how-do-i-seed-the-app-with-fake-postshangouts)
  8. [How do I add myself as a contributor?](#how-do-i-add-myself-as-a-contributor)
  9. [How do I manually create an active Hangout link on the development version of the app?](#how-do-i-manually-create-an-active-hangout-link-on-the-development-version-of-the-app)
4. [Helpful Reminders](#helpful-reminders)
5. [Editorconfig](#editorconfig)


# The Quick Steps on Contributing:
1. Join the community!
2. Install meteor!
3. Fork and clone the repository.
4. Install your development environment.
5. Create a branch on the issue you want to work on.
6. Submit a Pull Request and associate it with the issue.
7. (Optional) Add yourself as a contributor to both the README.md and our About page.  


# The More Detailed Steps on Contributing:
1. Say hello on the [#codebuddies-meta](https://codebuddies.slack.com/messages/codebuddies-meta/) channel in the Slack. Feel free to ask questions here, or to ask for someone to review your pull request. (If you don't have an account with codebuddies.slack.com, please visit [codebuddies.org](http://codebuddies.org) to sign up.)
2. Install Meteor! On mac, you should use this command: 

   `curl "https://install.meteor.com/?release=1.3.2.4" | sh`

On Windows, you should run the official installer [here](https://www.meteor.com/install). If you're unsure whether you already have meteor installed, type `meteor --version` in your command line to check. You should see that you have meteor version 1.3.2.4.

3. Please star this repository! We need to reach 100 stars so that we can apply to the [Open Collective](https://opencollective.com/opensource/apply).
  [Edit - We're already there! But still star this repo, so others can hear about what we're doing!]
  
4. Fork this repository! Once you have a copy of this repo on your own account, clone this repo to your computer by typing in something like:

  `git clone https://github.com/codebuddiesdotorg/codebuddies.git`

  (Replace the URL with your own repository URL path.)
  
5. Run `cd codebuddies`. Then, set up this repository as an upstream branch using:
  * `git remote add upstream https://github.com/codebuddiesdotorg/cb-v2-scratch.git`

  Now, whenever you want to sync with the owner repository. Do the following:
  * `git fetch upstream`
  * `git checkout staging`
  * `git merge upstream/staging`
  
  Note: You can type `git remote -v` to check which repositories your `origin` and `upstream` are pointing to.

6. Type `meteor npm install` to install the initial meteor packages (you have to do this once!).

7. Then, run `meteor --settings settings-development.json` in your terminal to start up the app in your browser ([http://localhost:3000](http://localhost:3000)). Note that the first time you do this, it may take a while (a few minutes) for the app to start up.
  * (`meteor npm run meteor:dev` can also run the app, but will likely [use up your CPU](https://github.com/meteor/meteor/issues/4314).)
  * Also note: if you see an error in your terminal asking you to `meteor npm install --save faker`, please run that command!

8.Look at some of the [open issues](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues) and identify one that sparks your interest.

If you want to work on the issue, leave a comment on it saying that you're working on it!

Then, create a new branch by typing `git checkout -b BRANCHNAME`. Replace BRANCHNAME with what you want to name the branch. Conventionally, you should use the issue number in your branch name. For example, if you decided to work on issue https://github.com/codebuddiesdotorg/codebuddies/issues/491, you should type `git checkout -b issue-491` to create a branch named `issue-491`.

9. If you have any questions about the issue you're looking at, you can leave a comment in there, or ask in the [#codebuddies-meta Slack channel](https://codebuddies.slack.com/messages/codebuddies-meta). Read below for more instructions about how to work with branches.
10. Type `git branch -a` to see a list of all the branches besides `staging`, the default branch you're in. Note that if you want to switch to an already-created branch, you would type `git checkout BRANCHNAME`. You can read more about how to create a new branch to work on an issue below.
11. Once you finish making your changes, commit and push your changes.
12. Submit your Pull Request! See some tips on [how to create the perfect pull request](https://github.com/blog/1943-how-to-write-the-perfect-pull-request).
13. (Optional) Add yourself as a contributor, if you haven't done so already. Steps are listed [below](#how-do-i-add-myself-as-a-contributor).

If you see a bug in the app or have a feature request, feel free to [create a new issue](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/new) on the Github repo!


# Common Questions
### How do I start up the app?
* `meteor npm install`
* `meteor --settings settings-development.json`

If you have any problems getting the app to start, feel free to ask in the #troubleshooting channel on the CodeBuddies Slack. (Click [here](http://codebuddiesmeet.herokuapp.com) for an invite to the Slack channel if you're not already on it.) Please mention:
- Your operating system (e.g. Windows, MacOSX, Linux, etc.)
- Which version of meteor you have installed (You can type `meteor --version` in your terminal to check)
- Whether or not you've run `meteor npm install` before you attempted to start the app.

### I've picked out an issue I want to work on and left a comment on the issue to tell everyone that I'm working on it. Now what?
- To work on a new feature, leave a comment on the issue saying that you're working on it. Then, you need to *create* a new branch for the issue. You can do it by typing:

  `git checkout -b NAME_OF_NEW_BRANCH`

  So for example, if you wanted to work on issue #29 [github.com/codebuddiesdotorg/cb-v2-scratch/issues/29](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/29), you should type:

    `git checkout -b fix/issue-29-limit-140-characters`

  Please remember to include the issue number in the name of the branch.

![screenshot of typing git checkout -b fix/issue-29-limit-140-characters](http://codebuddies.org/images/contributing-screenshot2.jpg)

How you name your branch doesn't really matter as long as you put the issue number in there, so that other people can figure out what you're working on. Putting the number of the issue in your branch name helps prevent duplicate branches.

All right. After we've created our branch, the next step is to push our new branch to the repo by typing:

  `git push origin NAME_OF_NEW_BRANCH`

Now we can make commits to our branch (`git commit -am "commit message"`) and `git pull` to get other people's changes to the branch, and `git push` our own commits to the branch.

Finally, when you're finished working on the fix or feature in your branch, you'll need to submit a pull request!

Click on the "pull request" button by going to https://github.com/codebuddiesdotorg/cb-v2-scratch/pulls and clicking on "new pull request." Next, select your branch, and submit.

One of the github maintainers (@linda or someone else) will look over your pull request and accept it after it is reviewed by volunteer contributors. Note that for best practice, the PR [may get "squashed" into one commit](http://softwareengineering.stackexchange.com/questions/263164/why-squash-git-commits-for-pull-requests). If you prefer that the merge not be squashed into one commit, just let us know in the PR! 

*Note 1* - If you've picked out an issue to work on, make sure you let people know that you're continuing working on it, if the fix happens to take 2 days or longer. An update every two dates by way of a comment on the issue will do. Doesn't necessarily have to be a fix. In case you're unable to continue on the issue for some reason, just let people know that as well so that someone else can claim it. If you do not update within a couple of days, it will be assumed that the issue is not being attended to and will be up for grabs.

*Note 2* - "Thou shalt not hijack a 'claimed' issue so long as the person who's claimed it has commented otherwise or one of the maintainers has added the unclaimed label onto it."

### What should I remember while I'm working on my branch?
- As you're working, it's always a good idea to check which branch you're in by typing `git branch`. When you first `git clone` the repo, you'll only see a single branch, but you can discover other branches you can check out by typing `git branch -a`.

  For example, to check out the `feature/active-users` branch, you would type `git checkout feature/active-users` in your command line.

- While you're working, you should try to merge in the latest from `master` occasionally while you are in your branch. You can do this by typing:

  * `git checkout staging`
  * `git pull`
  * `git checkout BRANCH_NAME`
  * `git merge master`

### How does the deployment process work?
Our staging site is located at [staging.codebuddies.org](http://staging.codebuddies.org/). Pull requests that are approved are  merged into the `staging` branch and automatically deployed to the staging site.

When we're ready to do a release, we'll merge the `staging` branch into the `master` branch via a pull request, Codeship will run, and we'll automatically see the changes live at [codebuddies.org](http://codebuddies.org)

### What do I do when I'm ready to merge my fix or feature back into the main app?
When you are ready, submit a PR on GitHub, and a member from the CodeBuddies community will review it.

If you have recently pushed a commit, you should see 'create a pull request' on the master repo. If you do not see it, GitHub provides [documentation on how to create a PR](https://help.github.com/articles/creating-a-pull-request/).

@anbuselvan is working on integrating javascript; automated testing will be available soon in the `dev/testing` branch.

### What are merge conflicts, and how do I resolve them?
Merge conflicts come up when there is a conflict between code that you've written and code that other people have `git push`ed into your branch.

Conflicts might also come up when you type `git merge staging` to merge in the changes from staging into your branch.

If you see a conflict, don't panic!

If you are unfamiliar with how to resolve a merge conflict in git, you should read this: [https://githowto.com/resolving_conflicts](https://githowto.com/resolving_conflicts).

In summary, the steps are:

1. open up the file(s) with the conflict.
2. Be sure to remove all traces of `>>>>>` , `======`, and `<<<<<<` from the file.
3. If you're unsure about a merge conflict, or would like to pair to solve it with someone else, ask in the #codebuddies-meta channel on Slack.
4. Save the file after you've cleared up the conflict.
5. `git add [filename]`.
6. `git commit -m "message" [filename]`.
7. You're done! Now you can continue to `git push` and `git pull` and `git merge staging` while you're inside your branch.

### How do I start up the app locally and log in as an admin?
1. add your email and username to ```settings-development.json```.
2. ```meteor reset && meteor --settings settings-development.json```.
3. you will receive your password in your email .
4. admin login ```http://localhost:3000/admin```.

Note: When you create a hangout in localhost:3000, a Slack notification will be sent to the #cb2-test channel. This emulates what happens when you create a hangout on codebuddies.org, where a Slack announcement about the hangout will appear in the #general channel.

### How do I seed the app with fake Posts/Hangouts?
When the app is run locally, there are no hangouts seeded by default. Hence to be able to see how things work out, some fake posts could be seeded to the app. To do this run the app with the following changes.

1. Open the ```settings-development.json``` file in the root directory of app.
2. Find the ```"seeder":false``` line inside the file and change it to ```"seeder":true```.
3. Now start the app normally using ```meteor --settings settings-development.json```
4. Now you can see that fake data is seeded to the app.

### How do I add myself as a contributor?
*Make sure you have recently `git pull` from `master` before continuing.*

Once you've submitted your PR, switch to the branch [`adding-contributor`](https://github.com/codebuddiesdotorg/cb-v2-scratch/tree/adding-contributor). Then, you can add yourself to both the README.md and on our About page. Keeping a separate branch for adding yourself as a contributor will alleviate most merge conflicts.

* Switch to contributor's branch
  * `git checkout adding-contributor`
* Merge master's changes into branch
  * `git merge master`
* **For the README.md:**
  * Open `readme.md` in your editor of choice.
  * Go to [How do I contribute to this project?](/readme.md#how-do-i-contribute-to-this-project) in the readme
  * Add your GitHub handler, GitHub profile page, and what you worked on _above the line "Add Your Name Above"_
    * example: `@Example, https://github.com/onlyforexample - provided an example on Contributing.md`
  * Commit your changes
*  **For the [About](https://codebuddies.org/about) Page:**
  * Open `client/templates/other/about.html` in your editor of choice
  * Add the following code above the comment "Add Your Name Above!" (NB: Best to `cmd + f` this line.):

```html
<a rel="popover" class="user-popover" title="ADD_SLACK_HANDLER_HERE
  <a href='ADD_TWITTER_LINK_HERE'><i class='fa fa-twitter'></i></a>
  <a href='ADD_GITHUB_LINK_HERE'><i class='fa fa-github'></i></a>
  <a href='ADD_PERSONAL_SITE_HERE'><i class='fa fa-link'></i></a>"  
  data-content="ADD INFORMATION ABOUT YOU AND HOW YOU CONTRIBUTED TO CODEBUDDIES" data-placement="top" data-toggle="popover">
  <img src="ADD_IMG_URL_HERE" class="img-circle" alt="YOUR_NAME"/>
</a>
```
  * Replace the following values:
    * **ADD_SLACK_HANDLER_HERE** - replace with your Slack handler (e.g., @sample)
    * **ADD_TWITTER_LINK_HERE** - replace with your Twitter link
      * If you don't have a Twitter account, delete `<a href='ADD_TWITTER_LINK_HERE'><i class='fa fa-twitter'></i></a>`
    * **ADD_GITHUB_LINK_HERE** - replace with your GitHub link
    * **ADD_PERSONAL_SITE_HERE** - replace with your actual site
      * If you don't have a personal site, delete `<a href='ADD_PERSONAL_SITE_HERE'><i class='fa fa-link'></i></a>`
    * **ADD INFORMATION ABOUT YOU AND HOW YOU CONTRIBUTED TO CODEBUDDIES** - replace this with the requested information!
    * **ADD_IMG_URL_HERE** - replace with a image URL of yourself! (Can be your GitHub profile picture.)
  * Commit and push your changes!
* [Submit a PR](https://help.github.com/articles/creating-a-pull-request/)! (You may link it to your issues' PR, so the code reviewer can review your contributors additions as well.)
* **Remember not to delete this branch, so that others can use this branch as well!**


### Helpful Reminders:
1. Remember, you can always check which branch you are in by typing `git branch` or `git branch -a` to see all the branches that exist.

2. Remember to `git pull` occasionally to get the new commits and branches others have pushed up.

3. To minimize large messes of merge conflicts, you can `git merge master` occasionally if you're working inside a branch that you intend to merge back into `master`. Make sure you're in this branch when you type `git merge master`.

4. Type `meteor --settings settings-development.json` (or alternatively, `meteor npm run meteor:dev`) to run this app. Your terminal will tell you to open up a new browser window at [http://localhost:3000](http://localhost:3000).

5. Remember to leave a comment on the issue if you decide to start working on an issue, so that others know.

6. Remember to join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss updates to this project and to ask questions. We'll be there!

### Editorconfig
Because everyone has their own preferred development tools, this project has an `.editorconfig` file in its root to help maintain code  consistency.  Please [download the appropriate plugin](http://editorconfig.org/#download) for your text editor or IDE - this will help to  ensure that your editor uses the rules configured in the `.editorconfig` file.
