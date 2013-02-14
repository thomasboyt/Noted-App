Noted.ListItem = DS.Model.extend({
  order: DS.attr('number'),
  indentionLevel: DS.attr('number', {defaultValue: 0}),
  text: DS.attr('string'),

  note: DS.belongsTo('Noted.Note'),

  // state
  isEditing: false,
  isActive: false,     // currently highlighted (cursor is on)
  isSelected: false,   // multiple selections

  // computed properties
  computedIndentionStyle: function() {
    var offset = this.get("indentionLevel") * 40;
    return "margin-left: " + offset + "px";
  }.property('indentionLevel'),

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
  }
})