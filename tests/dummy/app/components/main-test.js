import Component from '@ember/component';
import layout from '../templates/components/main-test';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import 'nzc_draggable';

export default Component.extend({
  store: inject(),
  tagName: 'main',
  layout,

  init() {
    this._super(...arguments);

    const
      store = this.get('store'),
      model = store.createRecord('some-item-wrap');

    for (let i = 0; i < 10; i++) {
      const item = store.createRecord('some-item', { order: i });

      model.get('items').pushObject(item);
    }

    this.set('_model', model);
  },

  items: computed('_model.items.@each.order', function() {
    if (!this.get('_model.items.length')) return;

    return this.get('_model.items').sortBy('order');
  })
});
