var bodyParser = require("body-parser");
import webhooks from "/server/slack/webhooks.js";
import iCalFeed from "/server/i-cal-feed.js";

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route("/callback/hangout/:_id", function(params, req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  //add in some checking ot make sure re.body.hangoutUrl is a hangout URL
  Hangouts.update(params._id, { $set: { url: req.body.hangoutUrl } }, function(err, result) {
    if (err) {
      console.log("/callback/hangout/:_id", err);
      res.statusCode = 500; // Internal Server Error
    } else {
      res.statusCode = 200;
    }
    res.end();
  });
});

Picker.route("/webhook/slack/", webhooks.handleNewEvent);
Picker.route("/webhook/slack-command", webhooks.handleNewCommand);
Picker.route("/i-cal-feed", iCalFeed.handleRequest);
