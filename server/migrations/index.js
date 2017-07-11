import {usersMigrationV1} from './users_migration_v1.js';


Meteor.startup(function(){
  const MIGRATION = true;

  if (MIGRATION && Migrations.find({title: 'USER_ROLES', collection: 'users', version: 1 }).count() < 1 ){
    try {
        usersMigrationV1();
    } catch (err) {

        throw err;
    }


  } else {
    console.log('nothing to migrate');
  }

});
