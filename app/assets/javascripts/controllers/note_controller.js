Noted.NoteController = Ember.ObjectController.extend({

  // set a listItem model, return a new listItem model with the same properties.
  clipboardProps: function (key, value) {
    if (arguments.length > 1) {
      if (value instanceof Noted.ListItem) {
        value = value.getProperties("text", "indentionLevel", "note");
      }
      this.set("_clipboardProps", value);
    }
    return this.get("_clipboardProps");
  }.property("_clipboardProps"),

  insertItemAt: function(index, indent) {

    this._shiftItemsAt(index, 1);

    var item = Noted.ListItem.createRecord({
      text: "",
      order: index,
      indentionLevel: indent,
      note: this.content,
      isEditing: true
    });

    Noted.store.commit();
  },

  insertClipboardAt: function(index) {
    var props = this.get("clipboardProps");
    if (props) {
      this._shiftItemsAt(index, 1);
      // todo: why is $.extend() needed? for some reason props is getting an "id" property set on it, which is insane.
      var item = Noted.ListItem.createRecord($.extend({}, props));
      item.set("order", index);
      Noted.store.commit();
    }
  },

  deleteItem: function(item) {
    var index = this.get("sortedItems").indexOf(item);
    item.deleteRecord();
    this._shiftItemsAt(index, -1);
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
    });
  }).property('content.listItems'),

  _shiftItemsAt: function(index, shift) {
    this.get("sortedItems").forEach(function(item) {
      if (item.get("order") >= index) {
        item.set("order", item.get("order") + shift);
      }
    });
  }
});