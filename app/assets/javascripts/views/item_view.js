Noted.ItemView = Ember.View.extend({
  templateName: "item_static",
  
  didInsertElement: function() {
    if (this.listItem.get("isEditing") == true) {
      this._toEditingView();
    }
  },

  editingObserver: function() {
    console.log(this.listItem.get("isEditing"));
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
    console.log('focusOut');
    var value = this.$("textarea").val();
    if(/^\s+$/.test(value) || value == "") {
      this.get('controller').deleteItem(this.get('listItem'));
      this.get("parentView")._changeActiveByOffset(-1);
    }
    else {
      this.set('listItem.isEditing', false);
      this.set('listItem.text', value);
    }
    Noted.store.commit();
  },

  doubleClick: function() {
    this.listItem.set("isEditing", true);
  },

  _toEditingView: function() {
    this.set("templateName", "item_editing");
    this.rerender();

    this.didInsertElement = function() {
      this.$("textarea").focus();
      this.$("textarea").height(this.$("textarea").prop("scrollHeight"));
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

Noted.ItemTextArea = Ember.TextArea.extend({
  didInsertElement: function() {
    this._super();
    this.resize();

    this.$().bind('paste', function(e) {
      // workaround: paste actually fires BEFORE the text has been pasted in
      setTimeout(function() {this.resize()}.bind(this), 0);
    }.bind(this));
  },

  willDestroyElement: function() {
    this.$().unbind('paste');
  },

  keyDown: function() {
    this._super();
    this.resize();
  },

  resize: function() {
    var textarea = this.$();
    textarea.height(textarea.prop('scrollHeight'));
  }
})