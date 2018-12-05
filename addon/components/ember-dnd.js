import Component from '@ember/component';
import { A } from '@ember/array';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import layout from '../templates/components/ember-dnd';
import 'npm:nzc_draggable';

const DEFAULT_BASE_CLASS = 'ember-dnd';

export default Component.extend({
  baseClass: DEFAULT_BASE_CLASS,

  classNameBindings: ['baseClass'],

  init() {
    this._super(...arguments);

    this.set('matrix', new A);
  },

  didInsertElement() {
    this._super(...arguments);

    const baseClass = this.get('baseClass');

    this.set('$spacer', this.$(`.${baseClass}__spacer`));
  },

  actions: {
    insertItem(item) {
      once(() => {
        this.get('matrix').pushObject(item);
      });
    },

    destroyItem(item) {
      this.get('matrix').removeObject(item);
    },

    onDragStart() {
      console.log(...arguments);
    },

    onDrag() {
      console.log(...arguments);
    },

    onDragEnd() {
      console.log(...arguments);
    }
  },

  layout
});
