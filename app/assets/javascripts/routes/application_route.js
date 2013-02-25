Noted.Router.map(function() {
  this.route("static/404", {path: "404"});
  this.resource('note', {path: "/notes/:note_id"});
});

// this is a little weird but convenient at least
Noted.windowRenderHelper = function(ctx) {
  var notesController = ctx.controllerFor('notes');
  notesController.set('content', Noted.Note.find());

  ctx.render('app_window');
  ctx.render('bottom_controls', {
    controller: notesController,
    into: 'app_window',
    outlet: 'bottom_controls'
  });
  ctx.render('dropbox_controls', {
    controller: ctx.controllerFor('dropbox'),
    into: 'bottom_controls',
    outlet: 'dropbox_controls'
  })
  ctx.render('list', {
    controller: notesController,
    into: 'app_window',
    outlet: 'list'
  });
}

Noted.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    Noted.windowRenderHelper(this);
  }
});

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
    notesController.set("selected", note);

    // todo: best way to not re-render window + list if already rendered (coming from index)
    // possible options: check referrer http://stackoverflow.com/questions/14831668/the-route-i-came-from-or-previous-route
    // or possibly test for list template's render status? is that accessible?
    // alt set some sort of Noted.listIsRendered global but that's crazy gross

    Noted.windowRenderHelper(this, notesController);
    this.render('note', {
      controller: noteController,
      into: 'app_window',
      outlet: 'note'
    });
  }
})

