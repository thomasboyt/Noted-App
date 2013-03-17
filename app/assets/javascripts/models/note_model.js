Noted.Note = DS.Model.extend({
  title: DS.attr('string'),
  created_date: DS.attr('date'),
  masterNodeId: DS.attr('string'),

  listItems: DS.hasMany('Noted.ListItem'),

  // we just store masterNode's ID for later retrieval
  masterNode: function(key, val) {
    if (arguments.length > 1) {
      this.set("masterNodeId", val.get("id"));
    }
    return Noted.ListItem.find(this.get("masterNodeId"));
  }.property(),

  sortedItems: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['order'],
      content: this.get('listItems')
    })
  }).property('listItems'),

  // only works on a note that is currently loaded (i.e. listItems are loaded)
  deleteItems: function() {
    var len = this.get("listItems.length");
    for (var i=0; i < len; i++) {
      // every time delete record happens, rest of the objects are shifted down one index.
      this.get("listItems").objectAt(0).deleteRecord();
    }
  },

  serializeToTxt: function() {
    var noteString = "";

    noteString += this.get("title") + "\n";
    noteString += this.get("created_date").toString() + "\n";

    noteString += "\n";

    this.get("sortedItems").forEach(function (item) {
      // spacing based on the item's indentation
      for (var i=0; i < item.get("depth"); i++) {
        noteString += "    ";
      }
      noteString += "* " + item.get("text") + "\n";
    });

    return noteString;
  },

  // TODO: FIX THIS
  // Don't really need to be *that* smart to compute parent/children...
  // ...more worried about how to hold references to previous created
  // notes, etc.
  parseFromTxt: function(text) {
    var lines = text.split("\n");

    this.set("title", lines[0])
    this.set("created_date", new Date(Date.parse(lines[1])))

    this.set("masterNode", Noted.ListItem.createRecord({
      text: "~~master node~~",
      depth: -1
    }));
    
    var lastNode = this.get("masterNode");

    for (var i=3; i<lines.length; i++) {
      var line = lines[i];

      var asteriskIndex = line.indexOf("*");
      if (asteriskIndex > -1) {
        var depth = (asteriskIndex / 4);

        var parent;
        if (depth > lastNode.get("depth"))
          parent = lastNode;  // assume it only increases by one at a time
        else if (depth == lastNode.get("depth"))
          parent = lastNode.get("parent");
        else {
          var diff = lastNode.get("depth") - depth;
          parent = lastNode.get("parent");
          for (var j = 0; j < diff; j++) {
            parent = parent.get("parent");    // this is just goofy as hell
          }
        }

        var text = line.slice(asteriskIndex+2);
        var order = i - 3;

        lastNode = Noted.ListItem.createRecord({
          order: order,
          text: text,
          depth: depth,
          parent: parent,
          note: this,
        });
      }
    }
  },

  didLoad: function() {
    // hacky: forces masterNode's children to be loaded.
    this.get("masterNode");
    this._super();
  }
});
