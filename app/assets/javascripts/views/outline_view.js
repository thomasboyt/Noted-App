// Entries view.
// Renders items, tracks the user's current position/selected item, etc.
// ***Try to remove the "state tracking" from the model. It's not a bad pattern but not a good one either.

Noted.OutlineView = Ember.View.extend({
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
        this.activeIndex = this.get("_active.order");
      }
      else {
        this.activeIndex = null;
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

  keyDown: function(e) {
    if (jwerty.is('tab/cmd+]', e)) {                    //tab, indent one level
      e.preventDefault();
      this.get("active").changeIndentBy(1);
    }

    if (jwerty.is('shift+tab/cmd+[', e)) {
      e.preventDefault();
      this.get("active").changeIndentBy(-1);
    }
    
    if (!this.get("active").get('isEditing')) {
      if (jwerty.is('k/up', e)) {                 //k, move up
        e.preventDefault();
        this._changeActiveByOffset(-1);
      }; 
      if (jwerty.is('j/down', e)) {                 //j, move down
        e.preventDefault();
        this._changeActiveByOffset(1);
      }; 
      if (jwerty.is('space/i',e )) {     //space or i, enter editing
        e.preventDefault();
        this.get("active").set('isEditing', true);
      }; 
      if (jwerty.is('enter/o', e)) {     //enter or o, insert new entry below cursor
        e.preventDefault();
        this.get("controller").insertItemAt(this.get("active").get("order")+1, this.get("active.indentionLevel"));
        this._changeActiveByOffset(1);
      }
      if (jwerty.is('backspace/d', e)) {      //backspace/delete (mac) or d, delete
        e.preventDefault();
        this.get("controller").deleteItemAt(this.activeIndex);
        this._changeActiveByOffset(0);
      }
      if (jwerty.is('h', e)) {                 //h, outdent one level
        e.preventDefault();
        this.get("active").changeIndentBy(-1);
      }
      if (jwerty.is('l', e)) {                 //l, indent one level
        e.preventDefault();
        this.get("active").changeIndentBy(1);
      }
    }
    else {
      e.stopPropagation();
      if (jwerty.is('enter', e)) {     //enter, end editing & save
        e.preventDefault();
        var value = this.$("input").val();
        this.get("active").set('isEditing', false);
        this.$("ul").focus();
        this.get("active").set("text", value);
        Noted.store.commit();
      }; 
      if (jwerty.is('esc', e)) {     //esc, CANCEL editing
        e.preventDefault();
        this.get("active").set('isEditing', false);
        this.$("ul").focus();
      }; 
    }
  },

  willDestroy: function() {
    this._super();
    this.items.forEach(function(item) {
      item.resetState();
    })
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this.activeIndex + offset;

    if (newIndex >= 0 && newIndex < this.items.get('length')) {
      this.set("active", this.get('controller.sortedItems').objectAt(newIndex));
    } 
    else if (newIndex <= 0) {
      // make sure it's scrolled to true top
      $(".body-pane .scroller").scrollTop(0);
    }
  }
});


Noted.TitleView = Ember.TextField.extend({
  focusOut: function(e) {
    Noted.store.commit();
  }
})