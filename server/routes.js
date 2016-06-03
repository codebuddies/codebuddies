var bodyParser = require('body-parser');

Picker.middleware(bodyParser.json());

Picker.route('/callback/hangout/:_id', function(params, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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