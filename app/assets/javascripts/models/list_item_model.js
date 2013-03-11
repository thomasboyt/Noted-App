Noted.ListItem = DS.Model.extend({
  order: DS.attr('number'),
  depth: DS.attr('number', {defaultValue: 0}),
  text: DS.attr('string'),

  note: DS.belongsTo('Noted.Note'),

  _parent: DS.belongsTo('Noted.ListItem'),
  children: DS.hasMany('Noted.ListItem'),

  // state
  isEditing: false,
  isActive: false,     // currently highlighted (cursor is on)
  isSelected: false,   // multiple selections
  isCanceling: false,  // for the esc key - workaround for focusout's inflexibility

  // computed properties
  computedIndentionStyle: function() {
    var offset = this.get("depth") * 40;
    return "margin-left: " + offset + "px";
  }.property('depth'),

  // todo: cache current depth somehow, and only call this when
  // parent has actually changed. maybe just call a parentChanged()
  // from parent's setter?
  // ofc, once this is cache'd, all you need to do is parent.depth+1...
  // depth: function() {
  //   var depthFinder = function(parent, inc) {
  //     if (!inc) var inc = 0;
  //     var next = parent.get("parent");
  //     if (next)
  //       return depthFinder(next, inc+1);
  //     else
  //       return inc;
  //   }
  //   return depthFinder(this);
  // }.property('parent'),

  updateDepth: function() {
    this.set('depth', this.get("_parent.depth")+1);
  },

  // only works for the changing item, not children of it!

  // todo: consider some degree of caching for better initial load performance
  markedText: function() {
    if (this.get("text"))
      return marked(this.get("text"));
  }.property('text'),

  parent: function(key, newParent) {
    if (arguments.length > 1) {
      if (this.get("_parent")) {
        this.get("_parent.children").removeObject(this);
      }
      this.set("_parent", newParent);
      this.get("_parent.children").pushObject(this);

      this.updateDepth();
      this.get("children").forEach(function (child) {
        child.updateDepth();
      });
    }
    return this.get("_parent");
  }.property('parent'),

  // methods
  resetState: function() {
    this.set("isEditing", false);
    this.set("isActive", false);
    this.set("isSelected", false);
  },

  deleteRecord: function() {
    // remove association from parent
    this.get("parent.children").removeObject(this);

    this.get("children").forEach(function (child) {
      child.set("parent", this.get("parent"));
    }.bind(this));

    this._super();
  }

});
