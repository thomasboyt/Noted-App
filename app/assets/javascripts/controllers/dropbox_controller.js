Noted.DropboxController = Ember.Controller.extend({
  stateDefaults: {
    didAuth: false,
    loggedIn: false,
    syncing: false,
    done: false,
    success: undefined,
    error: undefined,
  },

  init: function() {
    this.set("state", $.extend({}, this.stateDefaults));

    Noted.dropbox.authenticate({interactive: false}, function(error, client) {
      if (error) {
        console.log("error authenticating");
      }
      if (Noted.dropbox.isAuthenticated()) {
        this.set("state.loggedIn", true);
        console.log("Dropbox: Authenticated");
      } else {
        console.log("Dropbox: No authentication");
      }
      this.set("state.didAuth", true);
    }.bind(this));
    this._super();
  },

  // called by the view when the sync dialog is closed
  resetState: function() {
    this.set("state", $.extend({}, this.stateDefaults, {didAuth: true, loggedIn: true}));
  },

  // utility functions for importing/exporting

  // clears out the notes folder in Dropbox before exporting
  _clearNotesFolder: function() {
    var promise = new RSVP.Promise();

    Noted.dropbox.remove("notes/", function(error, stat) {
      // 404 just means the notes/ folder doesn't exist
      if (error && error.status != 404) {
        promise.reject(error);
      }
      promise.resolve(stat);
    })

    return promise;
  },

  // clears out local noteset before importing
  _destroyNoteset: function() {
    var promise = new RSVP.Promise();

    var notes = Noted.Note.find();

    // This horrifying little bit is a workaround for find()'s asynchronicity.
    // This almost needs an FAQ of its own, but the most obvious part, "why
    // iterate over notes' listItems instead of find()ing all" - when you
    // iterate over a hasMany assocation, you at least have the count of how
    // many there will be (though it won't actually load the data until after
    // you try to .get() it), but if I were to attempt to iterate over
    // Noted.listItem.find(), ember would have no idea how many there are
    if (notes.get("length") > 0) {
      notes.forEach(function (note) {
        note.get("listItems").forEach(function(item) {
          item.on('didLoad', function() {
            item.deleteRecord();
            if (note.get("listItems.length") == 0) {
              note.deleteRecord();
              if (notes.get('length') == 0) {
                Noted.store.commit();
                promise.resolve();
              }
            }
          });
        });
      });
    }
    else {
      promise.resolve();
    }

    return promise;
  },

  // ajax functions

  _getFiles: function() {
    var promise = new RSVP.Promise();

    Noted.dropbox.readdir("notes", function(error, files, stat) {
      if (error)
        promise.reject(error)
      promise.resolve(files);
    })

    return promise;
  },

  // fn : as -> cb -> void
  // should return a new function that returns a promise
  _createPromise: function(fn) {
    var wrapped = function() {
      var promise = new RSVP.Promise();
      var args = Array.prototype.slice.call(arguments, 0);
      args.push(function(error, stat) {
        if (error) {
          promise.reject(error);
        }
        promise.resolve(stat);
      })
      fn.apply(Noted.dropbox, args)
      return promise; 
    }
    return wrapped;
  },

  // syncing handlers

  _handleSuccess: function() {
    this.setProperties({
      "state.done": true,
      "state.syncing": false,
      "state.success": true
    });
  },

  _handleError: function(error) {
    this.setProperties({
      "state.done": true,
      "state.syncing": false,
      "state.success": false
    })
    console.log("Error while syncing: ");
    console.log(error);
  },

  exportDropbox: function(viewCallback) {

    this.set("state.syncing", true);
    var notes = Noted.Note.find();
    var listItems = Noted.ListItem.find();

    this._clearNotesFolder().then(function(stat) {
      var promises = [];

      notes.forEach(function(note) {
        var txt = note.serializeToTxt();
        var title = note.get("title");
        // strip slashes
        title.replace("/", "");
        title.replace("\\", "");
        var filename = "notes/" + note.get("id") + "-" + title + ".txt";

        var promise = this._createPromise(Noted.dropbox.writeFile)(filename, txt);
        promises.push(promise);
      }.bind(this));

      return RSVP.all(promises);
    }.bind(this)).then(function (results) {
      this._handleSuccess();
    }.bind(this), function (error) {
      this._handleError(error);
    }.bind(this));

  },

  importDropbox: function() {
    this.set("state.syncing", true);

    var filePromises = [];
    var fileContents;

    this._getFiles()
    .then(function (files) {
      files.forEach(function(filename) {
        var path = "notes/" + filename;
        var promise = this._createPromise(Noted.dropbox.readFile)(path);
        filePromises.push(promise);
      }.bind(this));

      return RSVP.all(filePromises);
    }.bind(this))

    // this is a bit weird because we run all of the file retrieval promises,
    // then store them outside the callback scope for later use, since the
    // first thing we need to do is destroy the noteset (which is actually
    // asynchronous, so it needs its own promise etc)
    .then(function(contents) {
      fileContents = contents;
      return this._destroyNoteset();
    }.bind(this))

    .then(function () {
      fileContents.forEach(function (contents, idx) {
        var note = Noted.Note.createRecord();
        note.parseFromTxt(contents);
      });

      Noted.store.commit();

      this._handleSuccess();
    }.bind(this), 

    function(error) {
      this._handleError(error);
    });
  }
})