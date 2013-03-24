Noted.ApplicationView = Ember.View.extend({
  classNames: ['wrapper'],
  init: function() {
    this._super();

    // body keybindings go here, for lack of a better place

    $('body').keydown(function(e) {
      if (jwerty.is('shift+/', e)) {
        $("#shortcuts-modal").modal();
      }
      if (jwerty.is('shift+f', e)) {
        $(".window").toggleClass("full-screen");

        if (localStorage.getItem("shouldFullscreen") == "true")
          localStorage.setItem("shouldFullscreen", "false");
        else
          localStorage.setItem("shouldFullscreen", "true");
      }
    })

    window.applicationCache.onupdateready = function(e) {
      $("#update-modal").modal();
    };

  },

  didInsertElement: function() {
    this.$("a.help-link").click(function(e) {
      e.preventDefault();
      $("#shortcuts-modal").modal();
    })

    $("#update-confirm").click(function(e) {
      window.applicationCache.swapCache();
      window.location.reload();
    });
  }
});
