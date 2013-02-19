Noted.Router.map(function() {
  this.route("404", {path: "404"});
  this.resource('note', {path: "/notes/:note_id"});
});

Noted.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    var notesController = this.controllerFor('notes');
    notesController.set('content', Noted.Note.find());
    this.render('app_window');
    this.render('list', {
      controller: notesController,
      into: 'app_window',
      outlet: 'list'
    })
  },

  events: {
    createNote: function() {
      this.controllerFor('notes').createNote();
    },
    deleteNote: function() {
      this.controllerFor('notes').deleteNote();
    }
  }
})

Noted.NotFoundRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('404');
  }
})

Noted.NoteRoute = Noted.IndexRoute.extend({
  setupController: function(controller, note) {
    controller.set('content', note)
  },

  model: function(params) {
    var m = Noted.Note.find(params.note_id)
    return m;
  },

  renderTemplate: function(some_controller, note) {
    if (!note) {
      this.transitionTo("404");
      return;
    }
    var notesController = this.controllerFor('notes').set('content', Noted.Note.find());
    var noteController = this.controllerFor('note').set('content', note);
    notesController.set("selected", note);

    // todo: best way to not re-render window + list if already rendered (coming from index)
    // possible options: check referrer http://stackoverflow.com/questions/14831668/the-route-i-came-from-or-previous-route
    // or possibly test for list template's render status? is that accessible?
    // alt set some sort of Noted.listIsRendered global but that's crazy gross

    this.render('app_window');
    this.render('list', {
      controller: notesController,
      into: 'app_window',
      outlet: 'list'
    });
    this.render('note', {
      controller: noteController,
      into: 'app_window',
      outlet: 'note'
    });
  }
})

