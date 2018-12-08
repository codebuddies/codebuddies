import faker from "faker";
import discussion_tags from "../../imports/data/discussion_tags";

export const discussionsCollectionSeeder = (user, dateTime) => {
  const tags = [];
  for (let i = 0; i < 3; ++i) {
    tags.push(faker.random.arrayElement(discussion_tags));
  }
  const channel = "#" + tags[0];

  const discussion = {
    document_type: "SEED",
    topic: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    tags: tags,
    channel: channel,
    created_at: dateTime,
    up_votes: [],
    down_votes: [],
    views: faker.random.number({ min: 5, max: 10 }),
    version: 0,
    response_count: faker.random.number({ min: 5, max: 10 }),
    visibility: faker.random.boolean(),
    locked: faker.random.boolean(),
    subscribers: [
      {
        id: user.id,
        username: user.username,
        avatar: user.profile.avatar.default
      }
    ],
    participants: [
      {
        id: user.id,
        username: user.username,
        avatar: user.profile.avatar.default
      }
    ],
    author: {
      id: user.id,
      username: user.username,
      avatar: user.profile.avatar.default
    },
    study_group: {
      id: "CB",
      title: "CB",
      slug: "CB"
    },
    email_notifications: {
      initial: faker.random.boolean()
    }
  };

  Discussions.insert(discussion);
};
