Noted.NotesController = Ember.ArrayController.extend({
  selected: null,

  createNote: function() {
    var note = Noted.Note.createRecord({
      title: "New Note",
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

    this.transitionTo('note', note)
    this.setSelected(note);
  },

  deleteNote: function() {
    var willDelete = window.confirm("Are you sure you want to delete this note?");
    if (willDelete) {

      // forEach breaks on deleteRecord (think about it: array gets smaller as it iterates) so we do it a somewhat old-fashioned way
      var len = this.get("selected.listItems.length");
      for (var i=0; i < len; i++) {
        console.log("Deleting");
        this.get("selected.listItems").objectAt(0).deleteRecord(); //yeah.
      }

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