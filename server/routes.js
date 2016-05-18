var bodyParser = require('body-parser');

Picker.middleware(bodyParser.json());

Picker.route('/hangout/:_id', function(params, req, res) {
	//add in some checking ot make sure re.body.hangoutUrl is a hangout URL	
  Hangouts.update(params._id, { $set: { url: req.body.hangoutUrl }}, function(err, result){ 
  	if (err) {
  		res.statusCode = 404;
  	} else {
  		res.statusCode = 200;
  	}
  	res.end();
  });
});