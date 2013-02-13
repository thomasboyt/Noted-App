Noted.ItemView = Ember.View.extend({
  isEditing: false,
  templateName: "item_static",

  didInsertElement: function() {

    if (this.listItem.get("isEditing") == true) {
      // switch to editing view when created
      this._toEditingView();
    }
  },

  editingObserver: function() {
    this.isEditing = this.listItem.get("isEditing");
    console.log("isediting is now " + this.isEditing);
    if (this.isEditing) {
      this._toEditingView();
    }
    else {
      this.set("templateName", "item_static");
      this.rerender();
    }
  }.observes("listItem.isEditing"),

  /*didInsertElement: function() {
    //if (this.get("isNew") == true)
  }*/

  _toEditingView: function() {
    this.set("templateName", "item_editing");
    this.rerender();

    this.didInsertElement = function() {
      this.$("input:first-child").focus();
    }
  }
});