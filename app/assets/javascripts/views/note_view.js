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
    this.$().bind('clickoutside', function(e) {
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
    this.$().unbind('clickoutside');
  },

  keyBindings: [
    'indent': {
      keys: {
        selected: '',
        editing: ''
      }
      fn: function() {
        this.get("active").changeIndentBy(1);
      }
    },
    'unindent': {
      'state': 
    }
  ],

  // todo: move as much logic as possible out of here and into either other
  // view functions or to controller functions
  keyDown: function(e) {
    if (this.get("active")) {
      if (jwerty.is('tab/cmd+]', e)) {
        e.preventDefault();
        this.get("active").changeIndentBy(1);
      }

      if (jwerty.is('shift+tab/cmd+[', e)) {
        e.preventDefault();
        this.get("active").changeIndentBy(-1);
      }

      if (!this.get("active.isEditing")) {
        if (jwerty.is('k/up', e)) {
          e.preventDefault();
          this._changeActiveByOffset(-1);
        }; 
        if (jwerty.is('j/down', e)) {
          e.preventDefault();
          this._changeActiveByOffset(1);
        }; 
        if (jwerty.is('space/i',e )) {
          e.preventDefault();
          this.get("active").set('isEditing', true);
        }; 
        if (jwerty.is('enter/o', e)) {
          e.preventDefault();
          this.get("controller").insertItemAt(this.get("active").get("order")+1, this.get("active.indentionLevel"));
          this._changeActiveByOffset(1);
        }
        if (jwerty.is('backspace/d/x', e)) {
          e.preventDefault();
          this.set("controller.clipboardProps", this.get("active"));
          this.get("controller").deleteItemAt(this._activeIndex);
          this._changeActiveByOffset(-1);
        }
        if (jwerty.is('h', e)) {
          e.preventDefault();
          this.get("active").changeIndentBy(-1);
        }
        if (jwerty.is('l', e)) {
          e.preventDefault();
          this.get("active").changeIndentBy(1);
        }

        // Clipboard
        if (jwerty.is('c', e)) {
          e.preventDefault();
          this.set("controller.clipboardProps", this.get("active"));
        }
        if (jwerty.is('v', e)) {
          e.preventDefault();
          if (this.get("controller.clipboardProps")) {
            this.get("controller").insertClipboardAt(this.get("active").get("order") +1);
            this._changeActiveByOffset(1);
          }
        }
      }
      else {
        e.stopPropagation();
        if (jwerty.is('enter', e)) {
          e.preventDefault();          
          this.$("ul").focusWithoutScrolling($(".scroller"));
        }; 
        if (jwerty.is('esc', e)) {
          e.preventDefault();
          this.set("active.isCanceling", true) // hacky state bit, for focusOut handler in item view
          this.$("ul").focusWithoutScrolling($(".scroller"));
        }
      }
    }

    else {
      if (jwerty.is('enter', e)) {
        e.preventDefault();
        this.get("controller").insertItemAt(0, 0);
        // below uses listItems instead of sortedList because sortedList breaks the store if it's accessed mid-save (weird, right?)
        // obviously irrelevant with a one-item list, but still
        this.set("active", this.get("controller.content.listItems").objectAt(0));
      }
    }
  },

  willDestroy: function() {
    this._super();
    this.get("controller.content.listItems").forEach(function(item) {
      item.resetState();
    })
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this._activeIndex + offset;

    // normal behavior
    if (newIndex >= 0 && !(newIndex >= this.get('controller.sortedItems.length'))) {
      this.set("active", this.get('controller.sortedItems').objectAt(newIndex));
    } 

    else if (newIndex < 0) {

      // scrolling past top OR deleting top item
      if (this.get('controller.sortedItems.length') > 0) {
        $(".body-pane .scroller").scrollTop(0); //used when scrolling up past item 0 (show title)
        $(this.set("active", this.get('controller.sortedItems').objectAt(0)));
      }

      // last item deleted
      else
        this.set("active", undefined); //no items in the list!
    }
  }
});


Noted.TitleView = Ember.TextField.extend({
  focusOut: function(e) {
    Noted.store.commit();
  }
})