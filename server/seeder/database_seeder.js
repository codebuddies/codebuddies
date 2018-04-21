import { userCollectionSeeder } from './user_collection_seeder';
import { hangoutCollectionSeeder } from './hangout_collection_seeder';
import { learningCollectionSeeder } from './learning_collection_seeder';
import { studyGroupCollectionSeeder } from './studygroup_collection_seeder';
import faker from 'faker';

export const databaseSeeder = () => {

  if (Meteor.users.find().count() <= 5) {

    for (let i = 1; i < 5; i++) {

       const user = userCollectionSeeder();

       //each 3rd user will have hangouts and learnings with a future date
       const dateTime = i%3 === 0 ? faker.date.future() : faker.date.past();

       for (let j = 0; j < 2; j++) {
         hangoutCollectionSeeder(user , dateTime);
         learningCollectionSeeder(user, dateTime);
         studyGroupCollectionSeeder(user, dateTime);
       }

    }

  }

  console.log("database seeded");

}
