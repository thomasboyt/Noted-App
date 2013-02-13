Noted.NoteController = Ember.ObjectController.extend({
  insertItemAt: function(index) {
    var item = Noted.ListItem.createRecord({
      text: "",
      order: index,
      note: this.content,
      isEditing: true
    });

    // This is the grossest and possibly (probably) wildly inefficient
    this.get("sortedItems").forEach(function (item, idx) {
      if (idx > index) {
        item.set("order", item.get("order") + 1);
      }
    });

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
    this.insertItemAt(0);
  }
})