##Mockup of what we're building (designed by @adachiu):
![very rough mockup of hangouts v2.0](http://codebuddies.org/images/landingpage3.png)

## How to contribute as a collaborator on this codebase:
1. Add your name on the google doc [http://bit.ly/codebuddies-hangouts-platform-v2-googledoc](http://bit.ly/codebuddies-hangouts-platform-v2-googledoc) if your name is not listed, and you want to be added as a collaborator. 
2. Say hello on the [#codebuddies-meta channel in the Slack](https://codebuddiesmeet.slack.com/messages/codebuddies-meta/). One of us will add you as a collaborator to the repo, so that you'll be able to commit and push/pull to the app! You can also ask `@linda` for a code walkthrough of the app.
3. [Install Meteor](https://www.meteor.com/install) and Node: [https://docs.npmjs.com/cli/install](https://docs.npmjs.com/cli/install) if you don't already have them installed. 
4. Clone this repo to your computer by typing in the command line:
  `git clone https://github.com/codebuddiesdotorg/cb-v2-scratch.git`
5. Type `npm run meteor:dev` in your terminal to start up the app in your browser (`localhost:3000`).
6. Look at some of the [open issues](https://github.com/codebuddiesdotorg/cb-v2-scratch/issues) and identify one that sparks your interest. If you have any questions about it, you can leave a comment in there, or ask in the (#codebuddies-meta Slack channel)[https://codebuddiesmeet.slack.com/messages/codebuddies-meta].

If you see a bug in the app or have a feature request, feel free to (create a new issue)[https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/new] on the Github repo!

### I've picked out an issue I want to work on and left a comment on the issue to tell everyone that I'm working on it. Now what?

- To work on a new feature, you need to create a new branch for the issue. You can do it by typing:

  `git checkout -b NAME_OF_NEW_BRANCH`

So for example, if you wanted to work on issue #29 (https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/29)[https://github.com/codebuddiesdotorg/cb-v2-scratch/issues/29], you should type:

  `git checkout -b fix/issue-29-limit-140-characters`

![screenshot of typing git checkout -b fix/issue-29-limit-140-characters](http://codebuddies.org/images/contributing-screenshot2.jpg)

How you name your branch doesn't really matter as long as you put the issue number in there, so that other people can figure out what you're working on. Putting the number of the issue in your branch name helps prevent duplicate branches.

All right. After we've created our branch, the next step is to push our new branch to the repo by typing:

  `git push origin NAME_OF_NEW_BRANCH`

Now we can make commits to our branch (`git commit -am "commit message"`) and `git pull` to get other people's changes to the branch, and `git push` our own commits to the branch. 

- Note: As you're working, it's always a good idea to check which branch you're in by typing `git branch`. When you first `git clone` the repo, you'll only see a single branch, but you can discover other branches you can check out by typing `git branch -a`. 

For example, to check out the `feature/active-users` branch, you would type `git checkout feature/active-users` in your command line.


- Our staging site is located at (http://cbv2-staging2.meteor.com/)[http://cbv2-staging2.meteor.com/]. There is also a branch named `staging`.

While you're working, you should try to merge in the commits to staging occasionally while you are in your branch. You can do this by typing:

`git merge staging`. 

Again, type this while you are in your branch. 

When you are ready to merge your branch back into the main app, [send a message to @linda on Slack](https://codebuddiesmeet.slack.com/messages/@linda/), and she will merge your changes into staging. Because everyone has commit privileges on this app, this is our alternative to using pull requests.

@anbuselvan is working on integrating javascript; automated testing will be available soon in the `dev/testing` branch. 


- If you are unfamiliar with how to resolve a merge conflict in git, you should read this: [https://githowto.com/resolving_conflicts](https://githowto.com/resolving_conflicts). 

A note on VIM for beginners: if you forget to include the commit message when you `git commit`, you'll be redirected to the VIM editor while you're in the terminal. Hit the `escape` key on your keyboard and then type `:wq` and `enter` on your keyboard to succcesfully finish the commit.


##Reminders: 
1. Remember, you can always check which branch you are in by typing `git branch` or `git branch -a` to see all the branches that exist. 
2. Remember to `git pull` occasionally to get the new commits and branches others have pushed up.
3. Remember to `git merge staging` occasionally if you're working inside a branch that you intend to merge back into staging. Make sure you're in this branch when you type `git merge staging`. 
4. Type `npm run meteor:dev` to run this app. Your terminal will tell you to open up a new browser window at http://localhost:3000. 
5. Remember to leave a comment on the issue if you decide to start working on an issue, so that others know.
6. Remember to join the `#codebuddies-meta` channel on the CodeBuddies Slack (go to [http://codebuddiesmeet.herokuapp.com](http://codebuddiesmeet.herokuapp.com) if you need an invitation to the Slack) to discuss updates to this project and to ask questions. We'll be there!



