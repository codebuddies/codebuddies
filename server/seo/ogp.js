//We are rendering meta data for crawler bots,
//This is an experimental functionality.


//templates
SSR.compileTemplate('seoLayout', Assets.getText('templates/seo/layout.html'));
SSR.compileTemplate('seoHome', Assets.getText('templates/seo/home.html'));
SSR.compileTemplate('seoAbout', Assets.getText('templates/seo/about.html'));
SSR.compileTemplate('seoFaq', Assets.getText('templates/seo/faq.html'));
SSR.compileTemplate('seoHangouts', Assets.getText('templates/seo/hangouts.html'));
SSR.compileTemplate('seoHangout', Assets.getText('templates/seo/hangout.html'));

//default fallback meta information
let defaultMetaData = {
  title: "CodeBuddies | Peer-to-peer organized study hangouts to learn faster",
  description: "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized virtual screensharing hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built.",
  url: Meteor.absoluteUrl(),
  image: Meteor.absoluteUrl('images/logo-circle.png'),
  card: "summary_large_image",
  creator: "@codebuddiesmeet",
  site: "@codebuddiesmeet",
  site_name: "CodeBuddies",
  type: "website"
}



// Blaze does not allow to render templates with DOCTYPE in it.
// This is a trick to made it possible
Template.seoLayout.helpers({
  getDocType: function() {
    return "<!DOCTYPE html>";
  }
});

//forwarding request to `?_escaped_fragment_=` if user-agent is a crawler bot
let seoPicker = Picker.filter(function(req, res) {
  let isCrawler = [];
  let userAgent = req.headers['user-agent'];
  isCrawler.push(/_escaped_fragment_/.test(req.url));
  if(userAgent){
      isCrawler.push(userAgent.indexOf('facebookexternalhit') >= 0);
      isCrawler.push(userAgent.indexOf('Slack') >= 0);
      isCrawler.push(userAgent.indexOf('Twitterbot') >= 0);
  }
  return isCrawler.indexOf(true) >= 0;
});


//Home
seoPicker.route('/', function(params, req, res){

  //set a meta data
  let data = defaultMetaData;
  data.title = 'Home | CodeBuddies';

  //generate a template with meta tags
  const html = SSR.render('seoLayout',{
    template:'seoHome',
    data:{data:data}
  });

  res.end(html);

});



//About
seoPicker.route('/about', function(params, req, res){
  //set a meta data
  let data = defaultMetaData;
  data.title = 'About | CodeBuddies';
  data.description = "Our community spends a lot of time helping each other on Slack, but it's hard to schedule study times in advance in a chatroom, and it's also hard to know who else is online possibly working on the same thing at the same time. This website solves those issues.";
  data.url = Meteor.absoluteUrl('about');

  //generate a template with meta tags
  const html = SSR.render('seoLayout',{
    template:'seoAbout',
    data:{data:data}
  });

  res.end(html);

});


//FAQ
seoPicker.route('/faq', function(params, req, res){
  //set a meta data
  let data = defaultMetaData;
  data.title = 'FAQ | CodeBuddies';
  data.description = "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge.";
  data.url = Meteor.absoluteUrl('faq');

  //generate a template with meta tags
  const html = SSR.render('seoLayout',{
    template:'seoFaq',
    data:{data:data}
  });

  res.end(html);

});


//Hangouts
seoPicker.route('/hangouts', function(params, req, res){
  //set a meta data
  let data = defaultMetaData;
  data.title = 'Hangouts | CodeBuddies';
  data.description = "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized screensharing/pair-programming hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built.";
  data.url = Meteor.absoluteUrl('hangouts');

  //generate a template with meta tags
  const html = SSR.render('seoLayout',{
    template:'seoHangouts',
    data:{data:data}
  });

  res.end(html);

});


//Single Hangout
seoPicker.route('/hangout/:hangoutId', function(params, req, res){
  let data = defaultMetaData;

  //featch the hangout details only if it's visible
  let hangout = Hangouts.findOne({_id:params.hangoutId, 'visibility':{ $ne: false} });

  //set a meta data only if hangout is visible
  //else set 404 info.
  if (hangout) {
    data.title = hangout.topic,
    data.description = hangout.description;
    data.url = Meteor.absoluteUrl('hangout/' + hangout._id );
    data.image = Meteor.absoluteUrl('images/logo-circle.png');
  }else {
    data.title = '404 | Page Not Found';
    data.description = 'The Page, You are looking for does not exexist';
    data.url = Meteor.absoluteUrl('404');
    data.image = Meteor.absoluteUrl('images/logo-circle.png');
  }

  //generate a template with meta tags
  const html = SSR.render('seoLayout',{
    template:'seoHangout',
    data:{data:data}
  });

  res.end(html);

});
