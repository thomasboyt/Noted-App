Noted.ControlsDropboxView = Ember.View.extend({
  asking: false,
  isExport: undefined,

  didInsertElement: function() {
    this.$("#dropbox-modal").on('hidden', function() {
      this.resetState();
    }.bind(this))
  },

  resetState: function() {
    this.get("controller").resetState();
    this.setProperties({
      asking: false,
      isExport: undefined
    })
  },

  loginToDropbox: function() {
    Noted.dropbox.authenticate(function(error, client) {
      if (error) {
        console.log('Error authenticating');
      }
    });  
  },

  exportDropbox: function() {
    // show Dropbox exporting modal
    this.$("#dropbox-modal").modal({
      keyboard: false,
      backdrop: "static"
    });
    this.set("asking", true);
    this.set("isExport", true);
  },

  importDropbox: function() {
    this.$("#dropbox-modal").modal({
      keyboard: false,
      backdrop: "static"
    });
    this.set("asking", true);
    this.set("isExport", false);
  },

  showDropboxHelp: function() {
    this.$("#dropbox-help-modal").modal();
  },

  confirm: function() {
    this.set("asking", false);
    if (this.get("isExport"))
      this.get("controller").exportDropbox();
    else
      this.get("controller").importDropbox();
  }
})
