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

    if (code==9) {         //tab, indent one level
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
      if (code==72) {                   //h, outdent one level
        e.preventDefault();
        this.active.changeIndentBy(-1);
      }
      if (code==76) {
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
      if (code==27) {
        e.preventDefault();
        var value = this.$("input:first-child").val();
        this.active.set('isEditing', false);
        this.$("ul:first-child").focus();
      }; //esc, CANCEL editing
    }
  },

  click: function(e) {
    //console.log('clicked')
  },

  _changeActiveByOffset: function(offset) {
    var newIndex = this.activeIndex + offset;

    if (newIndex >= 0 && newIndex < this.items.get('length')) {
      this.active.set("isActive", false);
      this.activeIndex = newIndex;
      this.active = this.get('controller.sortedItems').objectAt(this.activeIndex);
      this.active.set("isActive", true);

      //this._updateScrollPosition(newIndex);
    }

    
  },



  updateScrollPosition: function() {
    // to update the scroll position, we need to calculate the position of the bottom of the active item versus the position of the bottom of the screen, and scroll accordingly

    //so first... how do we find the item view element of the active one?
    //with a jquery selector for now, but may be more elegant way later

    // problem: .is-active is not getting updated before this line is called!
    
  }
});