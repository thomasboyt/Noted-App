Noted.ItemView = Ember.View.extend({
  isEditing: false,
  templateName: "item_static",
  
  didInsertElement: function() {
    if (this.listItem.get("isEditing") == true) {
      this._toEditingView();
    }
  },

  editingObserver: function() {
    this.isEditing = this.listItem.get("isEditing");
    if (this.isEditing) {
      this._toEditingView();
    }
    else {
      this.set("templateName", "item_static");
      this.rerender();
      this.didInsertElement = function() {this._updateScrollPosition()}
    }

  }.observes("listItem.isEditing"),

  activeObserver: function() {
    if (this.get('listItem.isActive')) {
      this._updateScrollPosition();
    }
    else {
      if (this.get("listItem.isEditing")) {
        this.set("listItem.isEditing", false);
      }
    }
  }.observes('listItem.isActive'),

  willDestroy: function() {
    this._super();
  },

  click: function() {
    // set as active
    this.get('parentView').changeActive(this.listItem);
  },

  doubleClick: function() {
    this.listItem.set("isEditing", true);
  },

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