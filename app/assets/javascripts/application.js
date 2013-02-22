// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ba-resize.min
//= require jquery.ba-outside-events.min
//= require jwerty
//= require twitter/bootstrap
//= require handlebars
//= require ember
//= require ember-data
//= require localstorage_adapter
//= require lib/dropbox
//= require_self
//= require noted
Noted = Ember.Application.create();
//= require_tree .

// before anyone sees this and goes "OOH FREE KEY," this is encoded per Dropbox's recommendation: https://github.com/dropbox/dropbox-js/blob/master/doc/getting_started.md#browser-and-open-source-applications
Noted.dropbox = new Dropbox.Client({
  key: "F2eMVQeQgVA=|iJGSwbJNhmZbCbv/2LyI8I34yQaO+x+XQjQ3JSnBAQ==", sandbox: true
});

Noted.dropbox.authDriver(new Dropbox.Drivers.Redirect({useQuery: true, rememberUser: true}));

if (!localStorage.getItem("Noted")) {
  var fixture = '{"Noted.Note":{"records":{"b4kfc":{"id":"b4kfc","title":"Welcome to Noted","created_date":"Tue, 19 Feb 2013 22:55:13 GMT","listItems":["tff7u","cjs5l","clo1n","u22lt","9vaj5","1pjmr","6h88p","eu9vu","ae4hi","a644a","7u0gc","rnco1","4chsn","h1hgp","mlv85","ehf8u"]},"muub7":{"id":"muub7","title":"About Noted","created_date":"Tue, 19 Feb 2013 23:01:50 GMT","listItems":["j4s54"]}}},"Noted.ListItem":{"records":{"tff7u":{"id":"tff7u","order":0,"indentionLevel":0,"text":"Click on any item to select it","note":"b4kfc"},"cjs5l":{"id":"cjs5l","order":1,"indentionLevel":0,"text":"Press space to edit it","note":"b4kfc"},"clo1n":{"id":"clo1n","order":2,"indentionLevel":0,"text":"Press enter to insert a new item below the current one","note":"b4kfc"},"u22lt":{"id":"u22lt","order":3,"indentionLevel":0,"text":"(VIM users can press I or O, respectively, for those last two commands)","note":"b4kfc"},"9vaj5":{"id":"9vaj5","order":4,"indentionLevel":0,"text":"Press up and down or k and j to traverse up and down the list","note":"b4kfc"},"1pjmr":{"id":"1pjmr","order":5,"indentionLevel":1,"text":"Press tab or l to indent an item","note":"b4kfc"},"6h88p":{"id":"6h88p","order":6,"indentionLevel":1,"text":"Inserting a new item will always put it at the same indentation level as the highlighted item","note":"b4kfc"},"eu9vu":{"id":"eu9vu","order":8,"indentionLevel":0,"text":"Press shift+tab or h to unindent an item","note":"b4kfc"},"ae4hi":{"id":"ae4hi","order":10,"indentionLevel":0,"text":"Press backspace (delete on Mac) or d to delete an item","note":"b4kfc"},"a644a":{"id":"a644a","order":7,"indentionLevel":5,"text":"You can indent as much as you want","note":"b4kfc"},"7u0gc":{"id":"7u0gc","order":11,"indentionLevel":0,"text":"Lines can be really long, like this one. The input text area will automatically expand as you type. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.","note":"b4kfc"},"rnco1":{"id":"rnco1","order":9,"indentionLevel":0,"text":"(if for some reason you REALLY like awkward Mac keybinds, you can use cmd+[ and cmd+] to unindent and indent)","note":"b4kfc"},"4chsn":{"id":"4chsn","order":12,"indentionLevel":0,"text":"Press esc on an item while editing to cancel your edit","note":"b4kfc"},"h1hgp":{"id":"h1hgp","order":13,"indentionLevel":0,"text":"Press the new button on the bottom left to create a new note, or the delete button to delete a note.","note":"b4kfc"},"mlv85":{"id":"mlv85","order":14,"indentionLevel":0,"text":"More inputs (including yanking and pasting) coming soon.","note":"b4kfc"},"ehf8u":{"id":"ehf8u","order":15,"indentionLevel":0,"text":"Pressing ? at any time will open a help popup","note":"b4kfc"},"j4s54":{"id":"j4s54","order":0,"indentionLevel":0,"text":"Noted is an EmberJS application that runs on Rails.","note":"muub7"}}}}'
  localStorage.setItem("Noted", fixture);

  // performance fixture
  
}