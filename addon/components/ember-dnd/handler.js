import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/handler';

export default Component.extend({
  classNames: ['ember-dnd__handler'],

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
