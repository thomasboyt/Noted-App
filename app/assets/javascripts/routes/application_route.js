Noted.Router.map(function() {
  this.route("static/404", {path: "404"});
  this.route("static/about", {path: "about"})
  this.resource('note', {path: "/notes/:note_id"});
});

// this is a little weird but convenient at least
Noted.renderWindow = function(ctx, showImport) {
  var notesController = ctx.controllerFor('notes');
  notesController.set('content', Noted.Note.find());

  var dropboxController = ctx.controllerFor("dropbox");
  dropboxController.set('notes', notesController.get("content"));
  dropboxController.set('showImport', showImport);

  ctx.render('app_window');
  ctx.render('controls/bottom', {
    controller: notesController,
    into: 'app_window',
    outlet: 'bottom_controls'
  });
  ctx.render('controls/dropbox', {
    controller: dropboxController,
    into: 'controls/bottom',
    outlet: 'dropbox_controls'
  });
  ctx.render('note_list', {
    controller: notesController,
    into: 'app_window',
    outlet: 'sidebar'
  });
}

Noted.IndexRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    Noted.renderWindow(this, true);

    if (this.controllerFor('note').get('content')) {
      this.controllerFor('notes').set('selected', undefined);
    }

    this.render('static/index', {
      into: "app_window",
      outlet: "content"
    });
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

    Noted.renderWindow(this, false);
    this.render('note', {
      controller: noteController,
      into: 'app_window',
      outlet: 'content'
    });
  }
})

