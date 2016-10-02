import faker from 'faker';


if(! Meteor.settings.isModeProduction && Meteor.settings.isSeedData){
  //users
  for (var i = 0; i < 6; i++) {
    var avatar = faker.internet.avatar();
    var user = {
      "username" :  faker.name.firstName(),
      "email": faker.internet.email(),
      "profile" : {
          "avatar" : {
              "default" : avatar,
              "image_192" : avatar,
              "image_512" : avatar
          }
      }
    }

    var id = Accounts.createUser({
      username : user.username,
      email : user.email,
      profile: user.profile
    })

    if(id){
      Roles.addUsersToRoles(id, 'user');

      //hangout and learnings
      for (var j = 0; j < 3; j++) {
        var topic = faker.lorem.sentence();

        if (j%2==0) {
          var start = faker.date.future();
          var end = start.setHours(start.getHours() + 1);
        }else {
          var start = faker.date.past();
          var end = start.setHours(start.getHours() + 1);
        }
        var hangoutType = ['silent', 'teaching', 'collaboration'];
        var hangout = {
            "topic" : topic,
            "slug" : topic.replace(/\s+/g, '-').toLowerCase(),
            "description" : faker.lorem.text(),
            "start" : start,
            "end" : end,
            "type" : faker.random.arrayElement(hangoutType),
            "host" : {
                "id" : id,
                "name" : user.username,
                "avatar" : avatar
            },
            "attendees" : [],
            "email_addresses" : [
                user.email
            ],
            "users" : [ id ],
            "day_reminder_sent" : true,
            "hourly_reminder_sent" : true,
            "views" : faker.random.number({min:5, max:10}),
        }

        var learning = {
          "title" : faker.lorem.sentence(),
          "userId" : id,
          "username" : user.name,
          "created_at" : end,
          "kudos" : 0
        }

        Hangouts.insert(hangout);
        Learnings.insert(learning);



      }//hangout and learnings ends

    }//if

  }//users ends


}
