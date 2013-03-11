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

  updateDepth: function() {
    console.log("updating depth of " + this.get("text"));
    this.set('depth', this.get("_parent.depth")+1);

    this.get("children").forEach(function(child) {
      child.updateDepth();
    });
  },

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
    }
    return this.get("_parent");
  }.property('parent'),

  stealChildren: function(newParent) {
    for (var i = this.get("children.length") - 1; i > -1; i--) {
      // still the dumbest pattern. necessary since setting parent will
      // remove it from the children array. isn't mutability grand?
      this.get("children").objectAt(i).set("parent", newParent);
    };
  },

  // methods
  resetState: function() {
    this.set("isEditing", false);
    this.set("isActive", false);
    this.set("isSelected", false);
  },

  deleteRecord: function() {
    // remove association from parent
    this.get("parent.children").removeObject(this);

    this.stealChildren(this.get("parent"));

    this._super();
  }

});
