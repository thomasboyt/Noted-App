Noted.Router.map(function() {
  this.route("about", {path: "about"});
  this.resource('note', {path: "/notes/:note_id"});
});

Noted.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    var noteController = this.controllerFor('notes');
    noteController.set('content', Noted.Note.find());
    this.render('list', {
      controller: noteController,
      outlet: 'list'
    })
  }
})

Noted.NoteRoute = Noted.IndexRoute.extend({
  setupController: function(controller, note) {
    controller.set('content', note)
  },

  model: function(params) {
    return Noted.Note.find(params.note_id);
  },

  renderTemplate: function(some_controller, note) {
    var notesController = this.controllerFor('notes').set('content', Noted.Note.find());
    var noteController = this.controllerFor('note').set('content', note);
    notesController.setSelected(note);

    // todo: best way to not render list if already rendered (coming from index)
    // possible options: check referrer http://stackoverflow.com/questions/14831668/the-route-i-came-from-or-previous-route
    // or possibly test for list template's render status? is that accessible?
    // alt set some sort of Noted.listIsRendered global but that's crazy gross

    this.render('list', {
      controller: notesController,
      outlet: 'list'
    });
    this.render('note', {
      controller: noteController,
      outlet: 'note'
    })
  }
})