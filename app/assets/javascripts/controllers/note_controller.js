Noted.NoteController = Ember.ObjectController.extend({

  // masternode is a fake item that is the parent of top-level items. 
  // it should have the same interface for getting children (array of
  // uuids)
  
  // set a listItem model, return a new listItem model with the same properties.
  clipboardProps: function (key, value) {
    if (arguments.length > 1) {
      if (value instanceof Noted.ListItem) {
        value = value.getProperties("text", "depth", "note");
      }
      this.set("_clipboardProps", value);
    }
    return this.get("_clipboardProps");
  }.property("_clipboardProps"),

  insertItemAt: function(index) {
    var props = {
      text: "",
      note: this.content,
      isEditing: true,
    };

    this._insertItem(index, props);

    Noted.store.commit();
  },

  _insertItem: function(index, props) {
    this._shiftItemsAt(index, 1);
    var previous = this.get("sortedItems").objectAt(index-1);
    var parent = previous.get("parent");
    props.parent = parent;
    props.order = index;
    var item = Noted.ListItem.createRecord(props);

    // handle inserting between parent and child
    if (item.get("depth") == previous.get("depth")) {
      previous.stealChildren(item);
    }
  },

  // indent and pull children along
  indentPull: function(item, prevIndex) {
    var newParent = this._findLastSibling(item);
    if (newParent) {
      item.set("parent", newParent);
      Noted.store.commit();
    }
  },

  // indent without pulling children along
  indentOnly: function(item) {
    var newParent = this._findLastSibling(item);
    if (newParent) {
      item.set("parent", newParent);
      item.stealChildren(newParent);
      Noted.store.commit();
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
        child.set("parent", item);
      });

      Noted.store.commit();
    }
  },
      
  insertClipboardAt: function(index) {
    var props = this.get("clipboardProps");
    if (props) {
      this._shiftItemsAt(index, 1);
      // todo: why is $.extend() needed? for some reason props is getting an "id" property set on it, which is insane.
      props = $.extend({}, props);
      this._insertItem(index, props);
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
