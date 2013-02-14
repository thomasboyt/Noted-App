Noted.Router.map(function() {
  this.route("about", {path: "about"});
  this.resource('note', {path: "/notes/:note_id"});
});

Noted.IndexRoute = Ember.Route.extend({

  renderTemplate: function() {
    var controller = this.controllerFor('notes');
    controller.set('content', Noted.Note.find());
    this.render('list', {
      controller: controller
    });
  }
});

Noted.NoteRoute = Ember.Route.extend({

  setupController: function(controller, note) {
    controller.set('content', note)
  },

  model: function(params) {
    return Noted.Note.find(params.note_id);
  }
})