Noted.NotesController = Ember.ArrayController.extend({
  selected: null,

  createNote: function() {
    var name = prompt("Note name");

    var note = Noted.Note.createRecord({
      title: name,
      created_date: new Date()
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

  deleteNote: function() {
    var willDelete = window.confirm("Are you sure you want to delete this note?");
    if (willDelete) {
      this.selected.deleteRecord();
      Noted.store.commit();
      this.transitionTo("index");
    }
  },

  setSelected: function(note) {
    if (this.selected) {
      this.selected.set("isSelected", false);
    }
    note.set("isSelected", true);
    this.selected = note;
  },

  sortedList: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['created_date'],
      content: this.get('content'),
      sortAscending: false
    });
  }).property('content')
})