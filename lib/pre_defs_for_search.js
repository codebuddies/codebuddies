///////////////////
// For Search
//////////////////
RegExp.escape = function(query) {
  return query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Hangouts.search = function(query) {
  var cleanQueryString = RegExp.escape(query);
  var insensitiveCleanQueryString = new RegExp(cleanQueryString, "i");

  return Hangouts.find({$or: [ {topic:{ $regex:insensitiveCleanQueryString}}, {description:{ $regex: insensitiveCleanQueryString, $options: 'm'}},{creator:{ $regex: insensitiveCleanQueryString}} ] });
  //if we ever use tag the uncomment the following statement and comment the statement above this
  //return Hangouts.find({$or: [ {topic:{ $regex:insensitiveCleanQueryString}}, {description:{ $regex: insensitiveCleanQueryString, $options: 'm'}},{creator:{ $regex: insensitiveCleanQueryString}},{ $elemMatch: { tags: insensitiveCleanQueryString}} ] });

};
