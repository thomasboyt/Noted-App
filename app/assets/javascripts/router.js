Noted.Router = Ember.Router.extend({
  handleURL: function(url) {
    var results = this.router.recognizer.recognize(url),
      objects = [];

    if (!results) {
      this.handleRouteNotFound(url);
    }
    else {
      this._super(url);
    }
  },

  handleRouteNotFound: function(url) {
    this.transitionToRoute("static/404");
  }
})