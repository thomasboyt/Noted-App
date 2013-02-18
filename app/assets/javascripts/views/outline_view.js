// Entries view.
// Renders items, tracks the user's current position/selected item, etc.
// ***Try to remove the "state tracking" from the model. It's not a bad pattern but not a good one either.

Noted.OutlineView = Ember.View.extend({
  active: undefined,
  activeIndex:0,

  init: function() {
    this._super();

    if (this.items.get("length") > 0) {
      this.active = this.items.objectAt(0);
      this.active.set("isActive", true);
    }
  },

  didInsertElement: function() {
    this.$("").bind('clickoutside', function(e) {
      this.changeActive(null);
    }.bind(this));

    this.$("ul").focus();
  },

  keyDown: function(e) {
    var code = e.keyCode;

    if (jwerty.is('tab/cmd+]', e)) {                    //tab, indent one level
      e.preventDefault();
      this.active.changeIndentBy(1);
    }

    if (jwerty.is('shift+tab/cmd+[', e)) {
      e.preventDefault();
      this.active.changeIndentBy(-1);
    }
    
    if (!this.active.get('isEditing')) {
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
        this.active.set('isEditing', true);
      }; 
      if (jwerty.is('enter/o', e)) {     //enter or o, insert new entry below cursor
        e.preventDefault();
        this.get("controller").insertItemAt(this.active.get("order")+1, this.active.get("indentionLevel"));
        this._changeActiveByOffset(1);
      }
      if (jwerty.is('backspace/d', e)) {      //backspace/delete (mac) or d, delete
        e.preventDefault();
        this.get("controller").deleteItemAt(this.activeIndex);
        this._changeActiveByOffset(0);
      }
      if (jwerty.is('h', e)) {                 //h, outdent one level
        e.preventDefault();
        this.active.changeIndentBy(-1);
      }
      if (jwerty.is('l', e)) {                 //l, indent one level
        e.preventDefault();
        this.active.changeIndentBy(1);
      }
    }
    else {
      if (jwerty.is('enter', e)) {     //enter, end editing & save
        e.preventDefault();
        var value = this.$("input:first-child").val();
        this.active.set('isEditing', false);
        this.$("ul:first-child").focus();
        this.active.set("text", value);
        Noted.store.commit();
      }; 
      if (jwerty.is('esc', e)) {     //esc, CANCEL editing
        e.preventDefault();
        var value = this.$("input:first-child").val();
        this.active.set('isEditing', false);
        this.$("ul:first-child").focus();
      }; 
    }
  },

  willDestroy: function() {
    this._super();
    this.items.forEach(function(item) {
      item.resetState();
    })
  },

  changeActive: function(item) {
    if (this.active) {
      this.active.set("isActive", false);
    }

    this.active = item;

    if (item) {
      item.set("isActive", true);
      this.activeIndex = this.active.get("order");
    }
    else {
      this.activeIndex = null;
    }
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this.activeIndex + offset;

    if (newIndex >= 0 && newIndex < this.items.get('length')) {
      this.changeActive(this.get('controller.sortedItems').objectAt(newIndex));
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