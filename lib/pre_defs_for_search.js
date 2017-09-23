"use strict";
///////////////////
// For Search
//////////////////
RegExp.escape = function(query) {
  if (query) {
    return query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  return '';
};

Hangouts.search = function(query) {
  var cleanQueryString = RegExp.escape(query);
  var insensitiveCleanQueryString = new RegExp(cleanQueryString, "i");

  return Hangouts.find({
    $or: [
      {topic:{ $regex:insensitiveCleanQueryString} },
      {description:{ $regex: insensitiveCleanQueryString, $options: 'm'} },
      {creator:{ $regex: insensitiveCleanQueryString}}
    ],

    visibility: true

    },{
    limit: 20

  });



};


Meteor.users.search = function(query) {
  var cleanQueryString = RegExp.escape(query);
  var insensitiveCleanQueryString = new RegExp(cleanQueryString, "i");
  return Meteor.users.find({$or: [ {'email':{ $regex:insensitiveCleanQueryString}},{'username':{ $regex:insensitiveCleanQueryString}}] });
};

StudyGroups.search = function(searchTerm) {
  return StudyGroups.find({
    $or :[
      {title: { $regex: RegExp.escape(searchTerm), $options: 'i' }},
      {tagline: { $regex: RegExp.escape(searchTerm), $options: 'i' }}
    ],

    visibility: true

    }, {
    limit: 20
  });
}
