///////////////////
// For Search
//////////////////
RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Hangouts.search = function(query) {
  return Hangouts.find({topic: { $regex: RegExp.escape(query)}});
  //return Hangouts.find({topic: { $regex: RegExp.escape(query), $options: 'i' }}, { limit: 50});
};
