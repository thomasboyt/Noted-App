// Entries view.
// Renders items, tracks the user's current position/selected item, etc.
// ***Try to remove the "state tracking" from the model. It's not a bad pattern but not a good one either.

Noted.NoteView = Ember.View.extend({
  _active: undefined,
  _activeIndex: 0,

  active: function(key, newActive) {
    if (arguments.length > 1) {
      var oldActive = this.get("_active");

      if (oldActive) {
        oldActive.set("isActive", false);
      }

      this.set("_active", newActive);

      if (newActive) {
        this.set("_active.isActive", true);
        this._activeIndex = this.get("_active.order");
      }
      else {
        this._activeIndex = null;
      }
    }

    return this.get("_active");
  }.property("_active"),

  didInsertElement: function() {
    this.$("ul").bind('clickoutside', function(e) {
      e.preventDefault();

      // so, normally, any element inside this.$() (i.e. the view div) would not trigger clickoutside. the problem is, if you have an editing item view and then click on another (or the same) list item to get out of it, the editing list view is updated before the handler is reached. because of this, e.target.parents() totally breaks (since the DOM's been updated and e.target no longer is attached!).
      // terribly lazy workaround: if it's an input or an li with class 'entry-item', we know it's inside. seems to be the only major cause of this issue. may change with circumstances.

      if ($(e.target).parent().hasClass("entry-item") || $(e.target).hasClass('entry-item')) {
        return; // no-op
      }
      else {
        this.set("active", undefined);
      }

    }.bind(this));
  },

  willDestroyElement: function() {
    this.$("ul").unbind('clickoutside');
  },

  keyBindings: {
    'indent': {
      keys: {
        hasSelected: ['tab', 'cmd+]', 'l'],
        isEditing: ['tab', 'cmd+]']
      },
      fn: function() {
        this.get("controller").indentOnly(this.get("active"));
      }
    },
    'indentGroup': {
      keys: {
        hasSelected: ['shift+l', 'shift+period'], 
      },
      fn: function() {
        this.get("controller").indentPull(this.get("active"));
      }
    },
    'unindent': {
      keys: {
        hasSelected: ['shift+tab', 'cmd+[', 'h', 'shift+h', 'shift+comma'],
        isEditing: ['shift+tab', 'cmd+[']
      },
      fn: function() {
        this.get("controller").unindent(this.get("active"));
      }
    },
    'scrollUp': {
      keys: {
        hasSelected: ['k', 'up']
      },
      fn: function() {
        this._changeActiveByOffset(-1);
      }
    },
    'scrollDown': {
      keys: {
        hasSelected: ['j', 'down']
      },
      fn: function() {
        this._changeActiveByOffset(1);
      }
    },

    'enterEditing': {
      keys: {
        hasSelected: ['space', 'i']
      },
      fn: function() {
        this.get("active").set('isEditing', true);
      }
    },
    'endEditing': {
      keys: {
        isEditing: ['enter']
      },
      fn: function() {
        this.$("ul").focusWithoutScrolling($(".scroller"));
      }
    },
    'cancelEditing': {
      keys: {
        isEditing: ['esc']
      },
      fn: function() {
        this.set("active.isCanceling", true); // hacky state bit, for focusOut handler in item view
        this.$("ul").focusWithoutScrolling($(".scroller"));
      }
    },

    'delete': {
      keys: {
        hasSelected: ['d', 'x', 'backspace', 'delete']
      },
      fn: function() {
        this.set("controller.clipboardProps", this.get("active"));
        this.get("controller").deleteItemAt(this._activeIndex);
        this._changeActiveByOffset(0);
      }
    },
    'copy': {
      keys: {
        hasSelected: ['c']
      },
      fn: function() {
        this.set("controller.clipboardProps", this.get("active"));
      }
    },
    'paste': {
      keys: {
        hasSelected: ['v', 'p']
      },
      fn: function() {
        if (this.get("controller.clipboardProps")) {
          this.get("controller").insertClipboardAt(this.get("active").get("order") +1);
          this._changeActiveByOffset(1);
        }
      }
    },

    'insertNew': {
      keys: {
        hasSelected: ['enter', 'o']
      },
      fn: function() {
        this.get("controller").insertItemAt(this.get("active").get("order")+1);
        this._changeActiveByOffset(1);
      }
    },
    'insertFirst': {
      keys: {
        noItems: ['enter']
      },
      fn: function() {
        this.get("controller").insertItemAt(0, 0);
        // below uses listItems instead of sortedList because sortedList breaks the store if it's accessed mid-save (weird, right?)
        // obviously irrelevant with a one-item list, but still
        this.set("active", this.get("controller.content.listItems").objectAt(0));
      }
    }
  },

  keyDown: function(e) {

    // jwerty can't handle modifiers on their lonesome

    // highlight items on shift:
    if (e.keyCode == 16) {
      e.preventDefault();
      this.highlightActiveChildren(true);
      this.$().one('keyup', function(e) {
        this.highlightActiveChildren(false);
      }.bind(this));
      return;
    }

    for (var key in this.keyBindings) {
      var binding = this.keyBindings[key];

      var state;
      if (this.get("active")) {
        if (this.get("active.isEditing") === true) {
          e.stopPropagation();  // keeps ? from bubbling up, etc
          state = "isEditing";
        }
        else state = "hasSelected";
      }
      else state = "noItems";

      var bindings = binding.keys[state];
      if (bindings) bindings = bindings.join("/");
      if (jwerty.is(bindings, e)) {
        e.preventDefault();
        binding.fn.bind(this)();
        break;
      }
    }
  },

  willDestroy: function() {
    this._super();
    this.get("controller.content.listItems").forEach(function(item) {
      item.resetState();
    });
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this._activeIndex + offset;

    // normal behavior
    if (newIndex >= 0 && !(newIndex >= this.get('controller.sortedItems.length'))) {
      this.set("active", this.get('controller.sortedItems').objectAt(newIndex));
    }

    else if (newIndex < 0) {

      // scrolling past top
      if (this.get('controller.sortedItems.length') > 0) {
        $(".body-pane .scroller").scrollTop(0); //used when scrolling up past item 0 (show title)
        this.set("active", this.get('controller.sortedItems.firstObject'));
      }

      // last item deleted
      else
        this.set("active", undefined); //no items in the list!
    }

    else if (newIndex >= this.get("controller.sortedItems.length")) {
      this.set("active", this.get("controller.sortedItems.lastObject"));
    }
  },

  highlightActiveChildren: function(isHighlighted) {
    if (isHighlighted)
      this.get("active.recursiveChildren").setEach("isHighlighted", true);
    else
      this.get("active.recursiveChildren").setEach("isHighlighted", false);
  } 
});


Noted.TitleView = Ember.TextField.extend({
  focusOut: function(e) {
    Noted.store.commit();
  },

  keyDown: function(e) {
    e.stopPropagation();
    // override default tab behavior
    if (jwerty.is('tab/enter', e)) {
      this.set("parentView.active", this.get("controller.sortedItems").objectAt(0));
    }
    this._super();
  }
});
