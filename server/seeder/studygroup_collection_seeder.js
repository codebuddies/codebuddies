import faker from 'faker';

export const  studyGroupCollectionSeeder = (user, dateTime) =>{
  let title = faker.lorem.sentence();
  const studyGroup = {
    "document_type": "SEED",
    "title": title,
    "slug": title.replace(/\s+/g, '-').toLowerCase(),
    "tagline": title,
    "tags": faker.lorem.words(3),
    "createdAt": dateTime,
    "members": [
      {
        "id": user.id,
        "name": user.username,
        "avatar": user.profile.avatar.default,
        "role": 'owner',
        "status": '',
        "status_modifiedAt": null
      }
    ],
    "visibility": true,
    "exempt_from_default_permission": false
  }
    studyGroupId = StudyGroups.insert(studyGroup);
    Roles.addUsersToRoles(user.id, 'owner', studyGroupId);
}
