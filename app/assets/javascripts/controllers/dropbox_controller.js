Noted.DropboxController = Ember.Controller.extend({
  init: function() {
    Noted.dropbox.authenticate({interactive: false}, function(error, client) {
      if (error) {
        console.log("error authenticating");
      }
      if (Noted.dropbox.isAuthenticated()) {
        this.set("loggedIn", true);
        // Cached credentials are available, make Dropbox API calls.
        console.log("Dropbox Authenticated");
        //this.set("loggedIn", true);
      } else {
        console.log("Dropbox: No authentication");
      }
    }.bind(this));
    this._super();
  }
})