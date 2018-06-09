BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowOriginForAll("http://*.materialdesignicons.com");
BrowserPolicy.content.allowOriginForAll("http://*.google.com");
BrowserPolicy.content.allowOriginForAll("http://*.gravatar.com");
BrowserPolicy.content.allowOriginForAll("https://*.quilljs.com");
var trusted = [
  "*.herokuapp.com",
  "*.gstatic.com",
  "*.materialdesignicons.com",
  "*.googleapis.com",
  "*.google.com",
  "*.gravatar.com",
  "*.slack.com",
  "*.slack-edge.com",
  "*.wp.com",
  "*.quilljs.com",
  "*.githubusercontent.com",
  "*.twimg.com",
  "*.licdn.com",
  "*.wp.com",
  "*.codebuddies.org",
  "*.jit.si",
  "jitmeet.org",
  "*.jitsi.org",
  "jitsi.org",
  "*.google-analytics.com",
  "*.twavatar.com",
  "twavatar.com",
  "*.fontawesome.com"
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});
