Noted.NotesController = Ember.ArrayController.extend({
  selected: null,

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
  },

  setSelected: function(note) {
    if (this.selected) {
      this.selected.set("isSelected", false);
    }
    note.set("isSelected", true);
    this.selected = note;
  }
})