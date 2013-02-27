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
//= require lib/marked
//= require jwerty
//= require twitter/bootstrap
//= require handlebars
//= require ember
//= require ember-data
//= require rsvp
//= require localstorage_adapter
//= require lib/dropbox
//= require_self
//= require noted
Noted = Ember.Application.create();
//= require_tree .

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

if (!localStorage.getItem("Noted")) {
  var fixture = '{"Noted.Note":{"records":{"v7bpr":{"id":"v7bpr","title":"Welcome to Noted","created_date":"Tue, 19 Feb 2013 22:55:13 GMT","listItems":["edpqh","kctpu","k41cl","36bg5","t7sgi","r76fo","t4bup","ma506","hv2na","5n96f","hkflp","hinli","ro83u","o5imq","jnvie","h11hn","1h84q","sc3f8","8tkek","unasr","467fd","8t5rj","ut58t","13fgu","5ufqg","2bbu3","rnvhc"]}}},"Noted.ListItem":{"records":{"edpqh":{"id":"edpqh","order":2,"indentionLevel":1,"text":"Press space to edit it","note":"v7bpr"},"kctpu":{"id":"kctpu","order":3,"indentionLevel":1,"text":"Press enter to insert a new item below the current one","note":"v7bpr"},"k41cl":{"id":"k41cl","order":4,"indentionLevel":1,"text":"(VIM users can press I or O, respectively, for those last two commands)","note":"v7bpr"},"36bg5":{"id":"36bg5","order":5,"indentionLevel":1,"text":"Press up and down or k and j to traverse up and down the list","note":"v7bpr"},"t7sgi":{"id":"t7sgi","order":6,"indentionLevel":2,"text":"Press tab or l to indent an item","note":"v7bpr"},"r76fo":{"id":"r76fo","order":7,"indentionLevel":2,"text":"Inserting a new item will always put it at the same indentation level as the highlighted item","note":"v7bpr"},"t4bup":{"id":"t4bup","order":8,"indentionLevel":6,"text":"You can indent as much as you want","note":"v7bpr"},"ma506":{"id":"ma506","order":9,"indentionLevel":1,"text":"Press shift+tab or h to unindent an item","note":"v7bpr"},"hv2na":{"id":"hv2na","order":10,"indentionLevel":1,"text":"(if for some reason you REALLY like awkward Mac keybinds, you can use cmd+[ and cmd+] to unindent and indent)","note":"v7bpr"},"5n96f":{"id":"5n96f","order":11,"indentionLevel":1,"text":"Press backspace (delete on Mac) or d to delete an item","note":"v7bpr"},"hkflp":{"id":"hkflp","order":12,"indentionLevel":1,"text":"Lines can be really long, like this one. The input text area will automatically expand as you type. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.","note":"v7bpr"},"hinli":{"id":"hinli","order":13,"indentionLevel":1,"text":"Press esc on an item while editing to cancel your edit","note":"v7bpr"},"ro83u":{"id":"ro83u","order":14,"indentionLevel":1,"text":"Press the new button on the bottom left to create a new note, or the delete button to delete a note.","note":"v7bpr"},"o5imq":{"id":"o5imq","order":16,"indentionLevel":0,"text":"Noted now features a full clipboard","note":"v7bpr"},"jnvie":{"id":"jnvie","order":17,"indentionLevel":1,"text":"Deleting an item, whether with d, backspace, or x, will place a copy in your clipboard","note":"v7bpr"},"h11hn":{"id":"h11hn","order":18,"indentionLevel":1,"text":"You can also copy an item with c...","note":"v7bpr"},"1h84q":{"id":"1h84q","order":19,"indentionLevel":1,"text":"...and press v to paste it.","note":"v7bpr"},"sc3f8":{"id":"sc3f8","order":20,"indentionLevel":0,"text":"Noted also has very beta Dropbox support!","note":"v7bpr"},"8tkek":{"id":"8tkek","order":21,"indentionLevel":1,"text":"You can sign in with Dropbox using the button in the bottom right, and import or export all of your notes as flat text files","note":"v7bpr"},"unasr":{"id":"unasr","order":22,"indentionLevel":1,"text":"This is an early feature, and should not be relied on as your exclusive backup choice! If you care about your notes, make sure to make copies of your notes folder in Dropbox every now and then.","note":"v7bpr"},"467fd":{"id":"467fd","order":23,"indentionLevel":1,"text":"Also, heed the various warnings in the sync dialogs - when you import or export, your entire note set will be replaced!","note":"v7bpr"},"8t5rj":{"id":"8t5rj","order":24,"indentionLevel":0,"text":"Finally, Noted now has offline support.","note":"v7bpr"},"ut58t":{"id":"ut58t","order":25,"indentionLevel":1,"text":"Visiting http://noted.herokuapp.com, even while completely offline (literally; try disabling your wi-fi), will give you a totally usable version of the page.","note":"v7bpr"},"13fgu":{"id":"13fgu","order":26,"indentionLevel":1,"text":"The flip side to this is that when Noted gets an update, it won\'t actually update in your browser until you refresh the page. You\'ll soon start seeing popups informing you when an update is available . Don\'t blame me, blame HTML5!","note":"v7bpr"},"5ufqg":{"id":"5ufqg","order":0,"indentionLevel":0,"text":"The quick tutorial (scroll down for new features!)","note":"v7bpr"},"2bbu3":{"id":"2bbu3","order":1,"indentionLevel":1,"text":"Click on any item to select it","note":"v7bpr"},"rnvhc":{"id":"rnvhc","order":15,"indentionLevel":1,"text":"Pressing ? at any time will open a help popup with more info about keyboard shortcuts","note":"v7bpr"}}}}'
  localStorage.setItem("Noted", fixture);

  // performance fixture
  
}