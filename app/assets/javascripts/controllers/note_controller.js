Noted.NoteController = Ember.ObjectController.extend({

  // masternode is a fake item that is the parent of top-level items. 
  // it should have the same interface for getting children (array of
  // uuids)
  
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
    var parent = this.get("sortedItems").objectAt(index-1).get("parent");
    var item = Noted.ListItem.createRecord({
      text: "",
      order: index,
      indentionLevel: indent,
      note: this.content,
      isEditing: true,
      parent: parent
    });

    Noted.store.commit();
  },

  // indent and pull children along
  indentPull: function(item, prevIndex) {
    var newParent = this._findLastSibling(item);
    if (newParent)
      item.set("parent", newParent);
  },

  // indent without pulling children along
  indentOnly: function(item) {
    var newParent = this._findLastSibling(item);
    if (newParent) {
      item.set("parent", newParent);
      
      for (var i = item.get("children.length") - 1; i > -1; i--) {
        // still the dumbest pattern. necessary since setting parent will
        // remove it from the children array. isn't mutability grand?
        item.get("children").objectAt(i).set("parent", newParent);
      };
    }
  },

  unindent: function(item, prevIndex) {
    var newParent = item.get("parent.parent");
    if (newParent) {
      item.set("parent", newParent);
      var lastSiblingChildren = this._findLastSibling(item).get("children");
      var newChildren = lastSiblingChildren.filter(function(child) {
        return child.get("order") > item.get("order");
      });
      newChildren.forEach(function(child) {
        console.log("new child " + child.get("text"));
        child.set("parent", item);
      });
    }
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
    var index = item.get("order");
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
  },

  _findLastSibling: function(item) {
    var idx = item.get("order"); 
    var siblings = item.get("parent.children");

    // sort siblings by order
    // todo: keep this on the model as a computed property?
    // alternatively sort without creating a whole damn array controller 
    // every time! this is expensive and temporary
    var sortedSiblings = Ember.ArrayController.create({
      content: siblings,
      sortProperties: ['order'],
      sortAscending: true
    });

    var closest = sortedSiblings.filter(function(item) {
      return item.get("order") < idx;
    }).get("lastObject");

    return closest;
  },

});
