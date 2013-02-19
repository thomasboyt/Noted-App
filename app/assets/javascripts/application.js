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
//= require jquery.ba-outside-events
//= require jwerty
//= require twitter/bootstrap
//= require handlebars
//= require ember
//= require ember-data
//= require localstorage_adapter
//= require_self
//= require noted
Noted = Ember.Application.create();
//= require_tree .

if (!localStorage.getItem("Noted")) {
  console.log("Created fixtures.")
  var fixture = '{"Noted.Note":{"records":{"q4vjp":{"id":"q4vjp","title":"Fixture Note 1","order":null,"listItems":["vtckp","900bj","fhg1l","ernj3","0qqob","5h5vf","pjakt","i4f3g"]},"fqm73":{"id":"fqm73","title":"Long Fixture","order":null,"listItems":["r2fjv","d3ou4","eu82m","jnls3","u7n7i","0tfie","kckhu","mecjv","adbq7","lkt0k","6aq9k","hos2c","25h9f","0f7ih","c9gb7","scjup","f7km8","lfoin","iei27","m81ki","l7m1o","chg0l","o6g9s","csm33","b6nv1","lqg8k","2767r"]}}},"Noted.ListItem":{"records":{"vtckp":{"id":"vtckp","order":0,"indentionLevel":0,"text":"Space to edit this","note":"q4vjp"},"900bj":{"id":"900bj","order":1,"indentionLevel":0,"text":"Press enter to create a new note one line below the cursor","note":"q4vjp"},"fhg1l":{"id":"fhg1l","order":2,"indentionLevel":0,"text":"Press backspace or d to delete an item","note":"q4vjp"},"ernj3":{"id":"ernj3","order":4,"indentionLevel":1,"text":"Press tab to indent an item (even when in editing mode)","note":"q4vjp"},"0qqob":{"id":"0qqob","order":5,"indentionLevel":1,"text":"Press h to unindent an item","note":"q4vjp"},"5h5vf":{"id":"5h5vf","order":3,"indentionLevel":0,"text":"Indention","note":"q4vjp"},"pjakt":{"id":"pjakt","order":6,"indentionLevel":0,"text":"Noted automatically saves as you edit.","note":"q4vjp"},"i4f3g":{"id":"i4f3g","order":7,"indentionLevel":0,"text":"Noted saves to localStorage, not to an external API (yet)","note":"q4vjp"},"r2fjv":{"id":"r2fjv","order":0,"indentionLevel":0,"text":"Blah","note":"fqm73"},"d3ou4":{"id":"d3ou4","order":1,"indentionLevel":0,"text":"Blah","note":"fqm73"},"eu82m":{"id":"eu82m","order":2,"indentionLevel":0,"text":"blah","note":"fqm73"},"jnls3":{"id":"jnls3","order":3,"indentionLevel":0,"text":"Blah","note":"fqm73"},"u7n7i":{"id":"u7n7i","order":4,"indentionLevel":0,"text":"blah","note":"fqm73"},"0tfie":{"id":"0tfie","order":5,"indentionLevel":0,"text":"","note":"fqm73"},"kckhu":{"id":"kckhu","order":6,"indentionLevel":0,"text":"","note":"fqm73"},"mecjv":{"id":"mecjv","order":7,"indentionLevel":0,"text":"","note":"fqm73"},"adbq7":{"id":"adbq7","order":8,"indentionLevel":0,"text":"","note":"fqm73"},"lkt0k":{"id":"lkt0k","order":9,"indentionLevel":0,"text":"","note":"fqm73"},"6aq9k":{"id":"6aq9k","order":10,"indentionLevel":0,"text":"","note":"fqm73"},"hos2c":{"id":"hos2c","order":11,"indentionLevel":0,"text":"","note":"fqm73"},"25h9f":{"id":"25h9f","order":12,"indentionLevel":0,"text":"","note":"fqm73"},"0f7ih":{"id":"0f7ih","order":13,"indentionLevel":0,"text":"","note":"fqm73"},"c9gb7":{"id":"c9gb7","order":14,"indentionLevel":0,"text":"","note":"fqm73"},"scjup":{"id":"scjup","order":15,"indentionLevel":0,"text":"","note":"fqm73"},"f7km8":{"id":"f7km8","order":16,"indentionLevel":0,"text":"","note":"fqm73"},"lfoin":{"id":"lfoin","order":17,"indentionLevel":0,"text":"","note":"fqm73"},"iei27":{"id":"iei27","order":18,"indentionLevel":0,"text":"","note":"fqm73"},"m81ki":{"id":"m81ki","order":19,"indentionLevel":0,"text":"","note":"fqm73"},"l7m1o":{"id":"l7m1o","order":20,"indentionLevel":0,"text":"","note":"fqm73"},"chg0l":{"id":"chg0l","order":21,"indentionLevel":0,"text":"","note":"fqm73"},"o6g9s":{"id":"o6g9s","order":22,"indentionLevel":0,"text":"","note":"fqm73"},"csm33":{"id":"csm33","order":23,"indentionLevel":0,"text":"","note":"fqm73"},"b6nv1":{"id":"b6nv1","order":24,"indentionLevel":0,"text":"","note":"fqm73"},"lqg8k":{"id":"lqg8k","order":25,"indentionLevel":0,"text":"lots of blank ones.","note":"fqm73"},"2767r":{"id":"2767r","order":26,"indentionLevel":0,"text":"last","note":"fqm73"}}}}'
  localStorage.setItem("Noted", fixture);

  // performance fixture
  
}