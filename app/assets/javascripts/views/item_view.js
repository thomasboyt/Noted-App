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
      this.didInsertElement = function() {this._updateScrollPosition()}
    }
    //this._updateScrollPosition();

  }.observes("listItem.isEditing"),

  /*didInsertElement: function() {
    //if (this.get("isNew") == true)
  }*/

  activeObserver: function() {
    if (this.get('listItem.isActive')) {
      this._updateScrollPosition();
    }
  }.observes('listItem.isActive'),

  _toEditingView: function() {
    this.set("templateName", "item_editing");
    this.rerender();

    this.didInsertElement = function() {
      this.$("input:first-child").focus();
    }
  },

  _updateScrollPosition: function() {
    var activeView = this.$();

    var viewportTop = $(window).scrollTop()
    var viewportBottom = viewportTop + $(window).height();
    var activeTop = $(activeView).position().top;
    var activeBottom = activeTop + $(activeView).height();

    //console.log("viewportBottom is " + viewportBottom + ". activeBottom is " + activeBottom);

    if (viewportTop > activeTop) {
      var offset = viewportTop - activeTop;
      $(window).scrollTop($(window).scrollTop() - offset);
    }
    else if (viewportBottom < activeBottom) {
      var offset = activeBottom - viewportBottom;
      $(window).scrollTop($(window).scrollTop() + offset);
    }
  }

});