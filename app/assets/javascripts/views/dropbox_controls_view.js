Noted.DropboxView = Ember.View.extend({
  loginToDropbox: function() {
    Noted.dropbox.authenticate(function(error, client) {
      if (error) {
        console.log('error loggin in');
      }
    });  
  }
})