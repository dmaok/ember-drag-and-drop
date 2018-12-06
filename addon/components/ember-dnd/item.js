import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/item';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['ember-dnd__item'],
  classNameBindings: ['isDragTarget:is-dnd-target'],

  didInsertElement() {
    this._super(...arguments);

    if (!this.get('$handler')) {
      this.set('$handler', this.$());
    }

    this.sendAction('insert', this);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.sendAction('destroy', this);
  },

  initEvents($handler) {
    $handler.nzc_draggable({
      onDragStart: this.onDragStart.bind(this),
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this)
    });
  },

  resetEvents($handler) {
    if (!$handler) return;

    $handler.nzc_draggable('reset');
  },

  onDragStart() {
    this.sendAction('dragStart', this, ...arguments);
    this.set('isDragTarget', true);
  },

  onDrag() {
    this.sendAction('drag', ...arguments);
  },

  onDragEnd() {
    this.sendAction('dragEnd', ...arguments);
    this.set('isDragTarget', false);
  },

  $handler: computed('_$handler', {
    get() {
      return this.get('_$handler');
    },

    set(key, $newHandler) {
      this.resetEvents(this.get('$handler'));

      this.set('_$handler', $newHandler);

      this.initEvents($newHandler);

      return $newHandler;
    }
  }),

  actions: {
    insertHandler($element) {
      this.set('$handler', $element);
    },

    destroyHandler() {
      this.set('$handler', null);
    }
  },

  layout
});
