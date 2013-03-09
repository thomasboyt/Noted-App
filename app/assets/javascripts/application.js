// Note: code in this file runs BEFORE Ember assets are loaded. 
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY
// BLANK LINE SHOULD GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ba-resize.min
//= require jquery.ba-outside-events.min
//= require lib/marked
//= require jwerty
//= require twitter/bootstrap
//= require handlebars
//= require ember
//= require ember-data
//= require rsvp
//= require localstorage_adapter
//= require lib/dropbox
//= require fixture
//= require_self
//= require noted
//= require_tree .

Noted = Ember.Application.create();

// encoded per Dropbox's recommendation: https://github.com/dropbox/dropbox-js/blob/master/doc/getting_started.md#browser-and-open-source-applications
Noted.dropbox = new Dropbox.Client({
  key: "F2eMVQeQgVA=|iJGSwbJNhmZbCbv/2LyI8I34yQaO+x+XQjQ3JSnBAQ==", sandbox: true
});

Noted.dropbox.authDriver(new Dropbox.Drivers.Redirect({useQuery: true, rememberUser: true}));

// set up markdown
marked.setOptions({
  parseBlocks: false,
  sanitize: true
});
