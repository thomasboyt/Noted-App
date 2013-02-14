Noted.NoteController = Ember.ObjectController.extend({
  insertItemAt: function(index, indent) {

    // This is the grossest and possibly (probably) wildly inefficient
    this.get("sortedItems").forEach(function (item, idx) {
      if (item.get("order") >= index) {
        item.set("order", item.get("order") + 1);
      }
    });

    var item = Noted.ListItem.createRecord({
      text: "",
      order: index,
      indentionLevel: indent,      // todo: indention level of whatever level parent was on
      note: this.content,
      isEditing: true
    });
    
    Noted.store.commit();
  },

  deleteItemAt: function(index) {
    this.get("sortedItems").objectAt(index).deleteRecord();
    Noted.store.commit();
  },

  // so I should probably figure out exactly how this works at some point
  sortedItems: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['order'],
      content: this.get('content.listItems')
    })
  }).property('content.listItems'),

  createItem: function() {
    this.insertItemAt(0,0);
  }
})