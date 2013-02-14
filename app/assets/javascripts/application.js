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
  var fixture = '{"Noted.Note":{"records":{"q4vjp":{"id":"q4vjp","title":"Fixture Note 1","order":null,"listItems":["vtckp","900bj","fhg1l","ernj3","0qqob","5h5vf","pjakt","i4f3g"]}}},"Noted.ListItem":{"records":{"vtckp":{"id":"vtckp","order":0,"indentionLevel":0,"text":"Space to edit this","note":"q4vjp"},"900bj":{"id":"900bj","order":1,"indentionLevel":0,"text":"Press enter to create a new note one line below the cursor","note":"q4vjp"},"fhg1l":{"id":"fhg1l","order":2,"indentionLevel":0,"text":"Press backspace or d to delete an item","note":"q4vjp"},"ernj3":{"id":"ernj3","order":4,"indentionLevel":1,"text":"Press tab to indent an item (even when in editing mode)","note":"q4vjp"},"0qqob":{"id":"0qqob","order":5,"indentionLevel":1,"text":"Press h to unindent an item","note":"q4vjp"},"5h5vf":{"id":"5h5vf","order":3,"indentionLevel":0,"text":"Indention","note":"q4vjp"},"pjakt":{"id":"pjakt","order":6,"indentionLevel":0,"text":"Noted automatically saves as you edit.","note":"q4vjp"},"i4f3g":{"id":"i4f3g","order":7,"indentionLevel":0,"text":"Noted saves to localStorage, not to an external API (yet)","note":"q4vjp"}}}}'
  localStorage.setItem("Noted", fixture);
}