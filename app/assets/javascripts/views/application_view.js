Noted.ApplicationView = Ember.View.extend({
  init: function() {
    this._super();

    // body keybindings go here, for lack of a better place

    $('body').keydown(function(e) {
      console.log(e);
      if (jwerty.is('shift+/', e)) {
        $("#shortcuts-modal").modal();
      }
    })
  }
});
