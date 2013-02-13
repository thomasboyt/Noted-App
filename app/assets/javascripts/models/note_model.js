Noted.Note = DS.Model.extend({
  title: DS.attr('string'),
  order: DS.attr('number'),

  listItems: DS.hasMany('Noted.ListItem')
});