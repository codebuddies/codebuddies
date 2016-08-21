BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowOriginForAll('http://*.materialdesignicons.com');
BrowserPolicy.content.allowOriginForAll('http://*.google.com');
var trusted = [
  '*.herokuapp.com',
  '*.gstatic.com',
  '*.materialdesignicons.com',
  '*.googleapis.com',
  '*.google.com',
  '*.gravatar.com',
  '*.slack.com',
  '*.slack-edge.com',
  '*.wp.com'
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});
