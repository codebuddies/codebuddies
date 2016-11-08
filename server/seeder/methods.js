import { Meteor } from 'meteor/meteor';
import { databaseSeeder } from './database_seeder.js';
import { databaseSeedRemover } from './database_seed_remover.js';

if (Meteor.settings.seeder) {

  databaseSeeder();

}else {

  databaseSeedRemover();
}
