Noted.NotesController = Ember.ArrayController.extend({
  //content: 

  createNote: function() {
    // obviously temporary
    var name = prompt("Note name");

    var note = Noted.Note.createRecord({
      title: name,
      //order: 
    });

    Noted.store.commit();
  }
})