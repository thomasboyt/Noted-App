// Entries view.
// Renders items, tracks the user's current position/selected item, etc.
// ***Try to remove the "state tracking" from the model. It's not a bad pattern but not a good one either.

Noted.OutlineView = Ember.View.extend({
  isEditing: false,
  active: undefined,
  activeIndex:0,

  init: function() {
    this._super();

    if (this.items.get("length") > 0) {
      this.active = this.items.objectAt(0);
      this.active.set("isActive", true);
    }
  },

  keyDown: function(e) {
    var code = e.keyCode;
    console.log(code);

    if (code==9) {                    //tab, indent one level
      e.preventDefault();
      this.active.changeIndentBy(1);
    }
    
    if (!this.active.get('isEditing')) {
      if (code==75) {                 //k, move up
        e.preventDefault();
        this._changeActiveByOffset(-1);
      }; 
      if (code==74) {                 //j, move down
        e.preventDefault();
        this._changeActiveByOffset(1);
      }; 
      if (code==32 || code==73) {     //space or i, enter editing
        e.preventDefault();
        this.active.set('isEditing', true);
      }; 
      if (code==13 || code==79) {     //enter or o, insert new entry below cursor
        e.preventDefault();
        this.get("controller").insertItemAt(this.active.get("order")+1, this.active.get("indentionLevel"));
        this._changeActiveByOffset(1);
      }
      if (code==8 || code==68) {      //backspace/delete (mac) or d, delete
        e.preventDefault();
        this.get("controller").deleteItemAt(this.activeIndex);
        this._changeActiveByOffset(0);
      }
      if (code==72) {                 //h, outdent one level
        e.preventDefault();
        this.active.changeIndentBy(-1);
      }
      if (code==76) {                 //j, indent one level
        e.preventDefault();
        this.active.changeIndentBy(1);
      }
    }
    else {
      if (code==13) {     //enter, end editing & save
        e.preventDefault();
        var value = this.$("input:first-child").val();
        this.active.set('isEditing', false);
        this.$("ul:first-child").focus();
        this.active.set("text", value);
        Noted.store.commit();
      }; 
      if (code==27) {     //esc, CANCEL editing
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
    this.active.set("isActive", false);
    this.active = item;
    item.set("isActive", true);
    this.activeIndex = this.active.get("order");
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this.activeIndex + offset;

    if (newIndex >= 0 && newIndex < this.items.get('length')) {
      this.changeActive(this.get('controller.sortedItems').objectAt(newIndex));
    } 
  }
});