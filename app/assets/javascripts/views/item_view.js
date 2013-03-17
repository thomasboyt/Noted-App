Noted.ItemView = Ember.View.extend({
  templateName: "item_static",

  didInsertElement: function() {
    if (this.listItem.get("isEditing") === true) {
      this._toEditingView();
    }
    if (this.get("listItem.isActive")) {
      this._updateScrollPosition();
    }
  },

  editingObserver: function() {
    if (this.listItem.get("isEditing")) {
      this._toEditingView();
    }
    else {
      this.set("templateName", "item_static");
      this.rerender();
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

  click: function(e) {
    if (this.get("listItem.isEditing")) {
      if ($(e.target).prop("tagName") != "TEXTAREA") {
        this.set('listItem.isEditing', false);
      }
    }
    else {
      this.set('parentView.active', this.get('listItem'));
    }
  },

  focusOut: function(e) {
    if (!this.get("listItem.isCanceling")) {
      var value = this.get("listItem.text");
      if(/^\s+$/.test(value) || value === "") {
        this.get('controller').deleteItem(this.get('listItem'));
        this.get("parentView")._changeActiveByOffset(-1);
      }
      else {
        this.set('listItem.isEditing', false);
        this.set('listItem.text', value);
      }
      Noted.store.commit();
    }
    else {
      if (this.get("oldValue") === "") { 
        this.get('controller').deleteItem(this.get('listItem'));
        this.get("parentView")._changeActiveByOffset(-1);
      };
      this.set("listItem.isEditing", false);
      this.set("listItem.isCanceling", false);
    }
  },

  doubleClick: function() {
    // make de-selectable so that a triple click will not select
    this.listItem.set("isEditing", true);
  },

  _toEditingView: function() {
    this.set("templateName", "item_editing");
    this.rerender();

    this.didInsertElement = function() {
      this.$("textarea").focus();
      this.$("textarea").height(this.$("textarea").prop("scrollHeight"));
    };
  },

  _updateScrollPosition: function() {
    var activeView = this.$();
    var container = $(".body-pane .scroller"); // don't like how hard coded this is - alternatives?

    var viewportTop = $(container).scrollTop();
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

Noted.ItemTextArea = Ember.TextArea.extend({
  old: undefined,
  cancel: false,

  didInsertElement: function() {
    this._super();
    this.resize();

    this.$().bind('paste', function(e) {
      // workaround: paste actually fires BEFORE the text has been pasted in
      setTimeout(function() {this.resize();}.bind(this), 0);
    }.bind(this));

    this.old = this.$().val();
    this.set("parentView.oldValue", this.old);
  },

  willDestroyElement: function() {
    this._super();
    this.$().unbind('paste');

    if (this.get("item.isCanceling")) {
      this.set("value", this.old);
    }
  },

  keyDown: function() {
    this._super();

    // wait for letter to be inserted before measuring resize
    setTimeout(function () {
      // checks to make sure the element still exists - i.e. ignore esc/enter
      if (this.$())
        this.resize();
    }.bind(this), 0)
  },

  resize: function() {
    var textarea = this.$();
    textarea.height(textarea.prop('scrollHeight'));
  }
});
