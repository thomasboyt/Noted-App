Noted.Router = Ember.Router.extend({
  handleURL: function(url) {
    // how the hell does emberjs not handle this natively?
    url = url.split('?')[0]

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
    this.transitionTo("static/404");
  },
})