import faker from 'faker';

export const  hangoutCollectionSeeder = (user, dateTime) =>{

  let topic = faker.lorem.sentence();
  let start = dateTime;
  const end = start.setHours(start.getHours() + 1);


  const hangoutType = ['silent', 'teaching', 'collaboration'];
  const hangout = {
      "document_type": "SEED",
      "topic" : topic,
      "slug" : topic.replace(/\s+/g, '-').toLowerCase(),
      "description" : faker.lorem.text(),
      "start" : start,
      "end" : end,
      "type" : faker.random.arrayElement(hangoutType),
      "host" : {
          "id" : user.id,
          "name" : user.username,
          "avatar" : user.avatar
      },
      "attendees" : [],
      "email_addresses" : [],
      "users" : [ user.id ],
      "day_reminder_sent" : true,
      "hourly_reminder_sent" : true,
      "views" : faker.random.number({min:5, max:10}),
  }

  Hangouts.insert(hangout);

}
