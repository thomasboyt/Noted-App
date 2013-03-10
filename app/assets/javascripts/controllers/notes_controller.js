Noted.NotesController = Ember.ArrayController.extend({
  _selected: undefined,

  selected: function(key, note) {
    if (arguments.length > 1) {
      if (note===undefined) {
        this.set("_selected", undefined);
      }
      else {
        if (this.get("_selected")) {
          this.get("_selected").set("isSelected", false);
        }
        note.set("isSelected", true);
        this.set("_selected", note);
      }
    }
    return this.get("_selected");
  }.property("_selected"),

  createNote: function() {
    var note = Noted.Note.createRecord({
      title: "New Note",
      created_date: new Date(),
    });

    note.set("masterNode", Noted.ListItem.createRecord({
      text: "~~master node~~"
    }));

    // add a single default list entry to the note
    note.get("listItems").addObject(Noted.ListItem.createRecord({
      text: "Edit me!",
      order: 0,
      indentionLevel: 0,
      parent: note.get("masterNode")
    }));

    Noted.store.commit();

    this.transitionToRoute('note', note);
    this.set("selected", note);
  },

  deleteNote: function() {
    var willDelete = window.confirm("Are you sure you want to delete this note?");
    if (willDelete) {

      // forEach breaks on deleteRecord (think about it: array gets smaller as it iterates) so we do it a somewhat old-fashioned way
      this.get("selected").deleteItems();

      this.get("selected").deleteRecord();
      this.set("selected", undefined);
      Noted.store.commit();
      this.transitionToRoute("index");
    }
  },

  sortedList: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['created_date'],
      content: this.get('content'),
      sortAscending: false
    });
  }).property('content')
})
