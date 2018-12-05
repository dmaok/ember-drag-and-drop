import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/handler';
import BaseItem from 'ember-drag-and-drop/mixins/components/base-item';

export default Component.extend(BaseItem, {
  name: 'handler',

  didInsertElement() {
    this._super(...arguments);

    this.sendAction('insert', this.$());
  },

  willDestroyElement() {
    this._super(...arguments);

    this.sendAction('destroy');
  },

  layout
});
