export const usersMigrationV1 = function () {

  console.log(`user migration begin ....`);
  const migration = {
    title: 'USER_ROLES',
    collection: 'users',
    version: 1
  }


  Meteor.users.find().forEach((user)=>{


    const roles = user.roles;

    if (roles) {
      Meteor.users.update({_id:user._id}, {$unset:{ roles : '' }});

      Roles.setUserRoles(user._id, roles, 'CB');
    }


  });

  Migrations.insert(migration);

  console.log(`user migration done ...`);


}
