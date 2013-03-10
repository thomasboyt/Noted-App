Noted.ListItem = DS.Model.extend({
  order: DS.attr('number'),
  indentionLevel: DS.attr('number', {defaultValue: 0}),
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
    var offset = this.get("indentionLevel") * 40;
    return "margin-left: " + offset + "px";
  }.property('indentionLevel'),

  // todo: consider some degree of caching for better initial load performance
  markedText: function() {
    if (this.get("text"))
      return marked(this.get("text"));
  }.property('text'),

  parent: function(key, newParent) {
    if (arguments.length > 1) {
      console.log("setting parent");
      if (this.get("_parent")) {
        this.get("_parent.children").removeObject(this);
      }
      this.set("_parent", newParent);
      this.get("_parent.children").pushObject(this);
      console.log(this.get("_parent.text"));
    }
    return this.get("_parent");
  }.property("parent"), 

  // methods
  changeIndentBy: function(add) {
    var newIndent = this.get("indentionLevel") + add;
    if (newIndent > -1)
      this.set("indentionLevel", newIndent);
    Noted.store.commit();
  },

  resetState: function() {
    this.set("isEditing", false);
    this.set("isActive", false);
    this.set("isSelected", false);
  },

  didLoad: function() {
    // "initialize" the children array
    // this.get("children").objectAt(0);
    this._super();
  }
});
