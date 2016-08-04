import _ from 'lodash';

giveMeKeyWord= function (topic){
  const categories = ['javascript','ruby','meteor','php','laravel', 'java', 'python', 'mongodb', 'html5', 'css3', 'nodejs', 'django', 'swift', 'git', 'veujs', 'reactjs', 'angularjs'];
  const ranking = {
    "javascript": 1,
    "ruby": 1,
    "java": 1,
    "php": 1,
    "paython": 1,
    "mongodb" : 1,
    "html5": 1,
    "html": 1,
    "css3":1,
    "css":1,
    "swift": 1,
    "git":1,
    "nodejs": 1,
    "linux": 1,
    "vuejs": 1,
    "django": 2,
    "rubyronrails": 2,
    "reactjs": 2,
    "angularjs": 2,
    "meteor": 2,
    "laravel": 2
  }


  var result = _.words(_.toLower(topic));

  pm = []
  _.forEach(categories, function(c) {
   _.forEach(result, function(r) {
      if(r===c){ pm.push(r)}
    });
  });

  if(pm.length === 0){
    return ":cb:";

  }
  var lux = {};

  _.mapKeys(ranking, function(value, key) {
    _.forEach(pm, function(p) {
       if(p===key){
          lux[key] = value;
       }
    });

  })

  return ":" + Object.keys(lux)[0] + ":";

}
