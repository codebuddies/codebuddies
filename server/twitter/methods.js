import Twitter from 'twitter';


var client = new Twitter({
  consumer_key: Meteor.settings.private.twitter.consumer_key,
  consumer_secret: Meteor.settings.private.twitter.consumer_secret,
  access_token_key: Meteor.settings.private.twitter.access_token_key,
  access_token_secret: Meteor.settings.private.twitter.access_token_secret
});

export const tweetHangout = (hangout)=>{

  const status = 'A hangout has been scheduled by ~'+ hangout.host.name +'. ' + Meteor.absoluteUrl('hangout/' + hangout._id) + ' #codebuddies';
  client.post('statuses/update', {status: status},  function(error, tweet, response) {
    if(error){
      console.log("error",JSON.stringify(error));
      //throw error;
    }
  });
}

export const tweetLearning = (learning)=>{

  const status = learning.title + ' ~' + learning.username + ' #TodayILearned' ;
  client.post('statuses/update', {status: status},  function(error, tweet, response) {
    if(error){
      console.log("error",JSON.stringify(error));
      //throw error;
    }
  });
}
