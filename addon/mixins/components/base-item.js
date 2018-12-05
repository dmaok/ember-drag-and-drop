import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  classNameBindings: ['_className'],

  _className: computed('baseClass', function() {
    const name = this.get('name');

    if (!name) return;

    return `${this.get('baseClass')}__${this.get('name')}`
  }),
});
