Noted.AppWindowView = Ember.View.extend({
  classNames: ['window'],

  init: function() {
    var shouldFullscreen = localStorage.getItem("shouldFullscreen");
    if (shouldFullscreen == "true") {
      this.classNames.push("full-screen");
    }
    this._super();
  }
});