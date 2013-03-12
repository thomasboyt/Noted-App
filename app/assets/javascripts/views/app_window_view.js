Noted.AppWindowView = Ember.View.extend({
  classNames: ['window'],

  init: function() {
    var shouldFullscreen = localStorage.getItem("shouldFullscreen");
    if (shouldFullscreen == "true")
      this.get("classNames").pushObject("full-screen");
    else 
      this.get("classNames").removeObject("full-screen");
    this._super();
  }
});
