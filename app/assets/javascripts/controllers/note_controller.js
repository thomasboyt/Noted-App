Noted.NoteController = Ember.ObjectController.extend({

  copy: function (item, deep) {
    var copy = item.getProperties("text", "depth", "note");
    if (deep)
      copy.children = item.deepCopy();
    this.set("clipboardProps", copy);
  },

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

    if (props.children) {
      props.children.forEach(function(childProps) {
        index += 1;
        var res = this._insertItem(index, childProps)
        var child = res.item;
        child.set("parent", item);
        index = res.index;
        
      }.bind(this));
    }

    // handle inserting between parent and child
    if (item.get("depth") == previous.get("depth")) {
      previous.stealChildren(item);
    }
    
   return {item: item, index: index};
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
      // todo: why is $.extend() needed? for some reason props is getting an "id" property set on it, which is insane.
      props = $.extend({}, props);
      this._insertItem(index, props);
      Noted.store.commit();
    }
  },

  deleteItem: function(item, recursive) {
    if (arguments.length == 1)
      recursive = false;
    var index = item.get("order");
    var count = item.deleteRecord(recursive);
    this._shiftItemsAt(index, -count);

    if (this.get("listItems.length") == 0) {
      this.get("listItems").addObject(Noted.ListItem.createRecord({
        text: "*(double click here to get started)*",
        order: 0,
        depth: 0,
        parent: this.get("masterNode")
      }));
    }

    Noted.store.commit();
  },

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
