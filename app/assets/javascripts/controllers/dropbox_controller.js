Noted.DropboxController = Ember.Controller.extend({
  syncing: false,
  done: false,
  success: undefined,
  error: undefined,

  init: function() {
    Noted.dropbox.authenticate({interactive: false}, function(error, client) {
      if (error) {
        console.log("error authenticating");
      }
      if (Noted.dropbox.isAuthenticated()) {
        this.set("loggedIn", true);
        console.log("Dropbox Authenticated");
      } else {
        console.log("Dropbox: No authentication");
      }
    }.bind(this));
    this._super();
  },

  _clearNotesFolder: function() {
    var promise = new RSVP.Promise();

    Noted.dropbox.remove("notes/", function(error, stat) {
      // 404 just means the notes/ folder doesn't exist
      if (error && error.status != 404) {
        promise.reject(error);
      }
      console.log("resolving");
      promise.resolve(stat);
    })

    return promise;
  },

  _getFiles: function() {
    var promise = new RSVP.Promise();

    Noted.dropbox.readdir("notes", function(error, files, stat) {
      if (error)
        promise.reject(error)
      promise.resolve(files);
    })

    return promise;
  },

  _handleSuccess: function() {
    this.setProperties({
      done: true,
      syncing: false,
      success: true
    });
  },

  _handleError: function(error) {
    this.set("done", true);
    this.set("syncing", false);
    this.set("success", false);
    console.log(error);
  },

  _createPromiseRead: function(filename) {
    var promise = new RSVP.Promise();
    Noted.dropbox.readFile(filename, function(error, contents, stat) {
      if (error)
        promise.reject(error);
      promise.resolve(contents);
    })
    return promise;
  },

  _destroyNoteset: function() {
    var promise = new RSVP.Promise();

    var notes = Noted.Note.find();

    // This horrifying little bit is a workaround for find()'s asynchronicity. 
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

  exportDropbox: function(viewCallback) {

    this.set("syncing", true);
    var notes = Noted.Note.find(); //todo: can we just get this from the notesController? seems costly
    var listItems = Noted.ListItem.find(); //see above...

    var promiseWrite = function(filename, contents) {
      var promise = new RSVP.Promise();

      Noted.dropbox.writeFile(filename, contents, function(error, stat) {
        if (error) {
          promise.reject(error);
        }
        promise.resolve(stat);
      });

      return promise;
    }

    this._clearNotesFolder().then(function(stat) {
      var promises = [];

      notes.forEach(function(note) {
        var txt = note.serializeToTxt();
        var title = note.get("title");
        // strip slashes
        title.replace("/", "");
        title.replace("\\", "");
        var filename = "notes/" + note.get("id") + "-" + title + ".txt";

        promises.push(promiseWrite(filename, txt));
      });

      return RSVP.all(promises);
    }.bind(this)).then(function (results) {
      // convert to this.setProperties() if that still works
      this._handleSuccess();
    }.bind(this), function (error) {
      this._handleError(error);
    }.bind(this));

  },

  importDropbox: function() {
    this.set("syncing", true);

    this._destroyNoteset().then(function() {
      return this._getFiles();
    }.bind(this))
    .then(function (files) {
      var promises = [];

      files.forEach(function(filename) {
        var path = "notes/" + filename;
        promises.push(this._createPromiseRead(path));
      }.bind(this));

      return RSVP.all(promises);
    }.bind(this))
    .then(function (file_contents) {

      file_contents.forEach(function (contents, idx) {
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