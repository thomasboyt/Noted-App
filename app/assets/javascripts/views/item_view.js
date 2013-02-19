Noted.ItemView = Ember.View.extend({
  templateName: "item_static",
  
  didInsertElement: function() {
    if (this.listItem.get("isEditing") == true) {
      this._toEditingView();
    }
  },

  editingObserver: function() {
    if (this.listItem.get("isEditing")) {
      this._toEditingView();
    }
    else {
      this.set("templateName", "item_static");
      this.rerender();
      //this.didInsertElement = function() {this._updateScrollPosition()}
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

  click: function(e) {
    if (this.get("listItem.isEditing")) {
      if ($(e.target).prop("tagName") != "INPUT") {
        this.set('listItem.isEditing', false);
      }
    }
    else {
      this.set('parentView.active', this.get('listItem'));
    }
    
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
    var container = $(".body-pane .scroller"); // don't like how hard coded this is - alternatives?

    var viewportTop = $(container).scrollTop()
    var viewportBottom = viewportTop + $(container).height();
    var activeTop = $(activeView).position().top;
    var activeBottom = activeTop + $(activeView).height();

    var offset;
    if (viewportTop > activeTop) {
      offset = viewportTop - activeTop;
      $(container).scrollTop($(container).scrollTop() - offset);
    }
    else if (viewportBottom < activeBottom) {
      offset = activeBottom - viewportBottom;
      $(container).scrollTop($(container).scrollTop() + offset);
    }
  }

});