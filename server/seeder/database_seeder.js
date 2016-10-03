import { userCollectionSeeder } from './user_collection_seeder';
import { hangoutCollectionSeeder } from './hangout_collection_seeder';
import { learningCollectionSeeder } from './learning_collection_seeder';

export const databaseSeeder = () => {

  if (Meteor.users.find().count() <= 5) {

    for (let i = 0; i < 5; i++) {

       const user = userCollectionSeeder();
       for (let j = 0; j < 2; j++) {
         hangoutCollectionSeeder(user);
         learningCollectionSeeder(user);
       }

    }

  }

  console.log("database seeded");

}
