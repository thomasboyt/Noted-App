Noted.Note = DS.Model.extend({
  title: DS.attr('string'),
  created_date: DS.attr('date'),

  listItems: DS.hasMany('Noted.ListItem')
});