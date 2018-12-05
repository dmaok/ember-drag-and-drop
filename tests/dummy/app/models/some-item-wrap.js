import EmberData from 'ember-data';

const { hasMany, Model } = EmberData;

export default Model.extend({
  items: hasMany('some-items')
});
