import faker from 'faker';

export const learningCollectionSeeder = (user) => {

  const learning = {
    "document_type": "SEED",
    "title" : faker.lorem.sentence(),
    "userId" : user.id,
    "username" : user.username,
    "created_at" : faker.date.past(),
    "kudos" : 0
  }

  Learnings.insert(learning);
}
