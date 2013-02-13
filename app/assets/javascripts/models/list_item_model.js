Noted.ListItem = DS.Model.extend({
  order: DS.attr('number'),
  indentionLevel: DS.attr('number', {defaultValue: 0}),
  text: DS.attr('string'),

  note: DS.belongsTo('Noted.Note'),

  // state
  isEditing: false,
  isActive: false,    // currently highlighted (cursor is on)
  isSelected: false   // multiple selections
})