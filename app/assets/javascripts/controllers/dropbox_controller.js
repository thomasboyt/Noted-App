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

  _deleteListItems: function(note) {
    var promise = new RSVP.Promise();
    var items = note.get("listItems");

    if (items.objectAt(0)._data) {
      for (var j = items.get("length") - 1; j >= 0; j--) {
        items.objectAt(j).deleteRecord();
      }
      promise.resolve(note);
    }

    else {
      items.forEach(function (item) {
        item.on("didLoad", function() {
          item.deleteRecord();
          if (items.get("length") == 0) {
            promise.resolve(note);
          }
        })
      })
    }
    return promise;
  },

  // clears out local noteset before importing
  _destroyNoteset: function() {
    var promise = new RSVP.Promise();

    var notes = this.get("notes");

    if (notes.get("length") > 0) {

      // yeah.
      var afterDeletedItems = function(note) {
        note.deleteRecord();

        if (notes.get("length") == 0) {
          promise.resolve();
        }
      }

      for (var i = notes.get("length") - 1; i >= 0; i--) {
        var note = notes.objectAt(i);
        var items = note.get("listItems");

        if (items.get("length") > 0) {
          this._deleteListItems(note).then(afterDeletedItems);
        }
        else {
          afterDeletedItems(note);
        }  
      }
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
