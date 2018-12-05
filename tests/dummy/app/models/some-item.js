import EmberData from 'ember-data';

const { attr, Model } = EmberData;

export default Model.extend({
  order: attr('number')
});
