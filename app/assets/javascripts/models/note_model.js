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

  serializeToTxt: function() {
    var noteString = "";

    noteString += this.get("title") + "\n\n";

    this.get("sortedItems").forEach(function (item) {
      // spacing based on the item's indentation
      for (var i=0; i < item.get("indentionLevel"); i++) {
        noteString += "    ";
      }
      noteString += "* " + item.get("text") + "\n";
    });

    return noteString;
  }
});