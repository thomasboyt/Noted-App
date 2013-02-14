Noted.NotesController = Ember.ArrayController.extend({
  createNote: function() {
    var name = prompt("Note name");

    var note = Noted.Note.createRecord({
      title: name,
      //order: 
    });

    // add a single default list entry to the note
    note.get("listItems").addObject(Noted.ListItem.createRecord({
      text: "Edit me!",
      order: 0,
      indentionLevel: 0,
    }));

    Noted.store.commit();
  }
})