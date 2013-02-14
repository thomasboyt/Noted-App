Noted.NoteController = Ember.ObjectController.extend({
  insertItemAt: function(index, indent) {

    this._shiftItemsAt(index, 1);

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

    this._shiftItemsAt(index, -1);

    Noted.store.commit();
  },

  // so I should probably figure out exactly how this works at some point
  sortedItems: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['order'],
      content: this.get('content.listItems')
    })
  }).property('content.listItems'),

  _shiftItemsAt: function(index, shift) {
    this.get("sortedItems").forEach(function(item) {
      if (item.get("order") >= index) {
        item.set("order", item.get("order") + shift)
      }
    })
  }
})