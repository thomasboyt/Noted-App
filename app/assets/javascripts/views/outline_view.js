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

    if (!this.active.get('isEditing')) {
      if (code==75) {                 //k, move up
        this._changeActiveByOffset(-1);
      }; 
      if (code==74) {                 //j, move down
        this._changeActiveByOffset(1);
      }; 
      if (code==32 || code==73) {     //space or i, enter editing
        this.active.set('isEditing', true);
      }; 
      if (code==13 || code==79) {     //enter or o, insert new entry below cursor
        this.get("controller").insertItemAt(this.activeIndex+1);
        e.preventDefault();
        this._changeActiveByOffset(1);
      }
    }
    else {
      if (code==13) {     //enter, end editing & save
        var value = this.$("input:first-child").val();
        this.active.set('isEditing', false);
        this.$("ul:first-child").focus();
        this.active.set("text", value);
      }; 
      if (code==27) {
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
    }
  }
});