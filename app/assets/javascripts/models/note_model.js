Noted.Note = DS.Model.extend({
  title: DS.attr('string'),
  created_date: DS.attr('date'),

  listItems: DS.hasMany('Noted.ListItem'),

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
      for (var i=0; i < item.get("indentionLevel"); i++) {
        noteString += "    ";
      }
      noteString += "* " + item.get("text") + "\n";
    });

    return noteString;
  },

  parseFromTxt: function(text) {
    var lines = text.split("\n");
    this.set("title", lines[0]);
    this.set("created_date", new Date(Date.parse(lines[1])));

    for (var i=3; i<lines.length; i++) {
      var line = lines[i];

      var asteriskIndex = line.indexOf("*");
      if (asteriskIndex > -1) {
        var indent = (asteriskIndex / 4);
        var text = line.slice(asteriskIndex+2);
        var order = i - 3;

        Noted.ListItem.createRecord({
          indentionLevel: indent,
          order: order,
          text: text,
          note: this
        });
      }
    }
  }
});
