///////////////////
// For Search
//////////////////
RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Hangouts.search = function(query) {
  //return Hangouts.find({topic: { $regex: RegExp.escape(query)}});
  return Hangouts.find({$or: [ {topic:{ $regex: RegExp.escape(query)}}, {description:{ $regex: RegExp.escape(query)}} ] });

  //if we ever use tag the uncomment the following statement and comment the statement above this
  //return Hangouts.find({$or: [ {topic:{ $regex: RegExp.escape(query)}}, {description:{ $regex: RegExp.escape(query)}},{ $elemMatch: { tags: RegExp.escape(query)}}  ] });


};
