import { Accounts } from 'meteor/accounts-base';
import faker from 'faker';

export const usersCollectionSeeder = ()=> {

  const avatar = '/default-avatar.png';
  let user = {
    "username" :  faker.name.firstName(),
    "profile" : {
        "document_type": "SEED",
        "avatar" : {
            "default" : avatar,
            "image_192" : avatar,
            "image_512" : avatar
        },
    }
  }

  user.id = Accounts.createUser(user);

  return user;

}
