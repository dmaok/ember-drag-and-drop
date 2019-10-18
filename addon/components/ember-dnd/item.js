import Component from '@ember/component';
import jQuery from 'jquery';
import layout from '../../templates/components/ember-dnd/item'
import {computed, action} from '@ember/object';

export default class Item extends Component {
  layout = layout;
  classNames = ['ember-dnd__item'];
  classNameBindings = ['isDragTarget:is-dnd-target'];

  didInsertElement() {
    super.didInsertElement(...arguments);

    if (!this.get('$handler')) {
      if (this.get('handlerSelector')) {
        this.set('$handler', this.element.querySelector(this.get('handlerSelector')));
      } else {
        this.set('$handler', this.element);
      }
    }

    this.insert(this);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this.destroy(this);
  }

  initEvents($handler) {
    $handler.nzc_draggable({
      onDragStart: this.onDragStart.bind(this),
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this)
    });
  }

  resetEvents($handler) {
    if (!$handler) return;

    $handler.nzc_draggable('reset');
  }

  onDragStart() {
    this.dragStart(this, ...arguments);
    this.set('isDragTarget', true);
  }

  onDrag() {
    this.drag(...arguments);
  }

  onDragEnd() {
    this.dragEnd(...arguments);
    this.set('isDragTarget', false);
  }

  @computed('_$handler')
  get $handler() {
    return this.get('_$handler');
  }

  set $handler($newHandler) {
    this.resetEvents(this.get('$handler'));
    this.set('_$handler', $newHandler);

    this.initEvents(jQuery($newHandler));

    return $newHandler;
  }

  @action
  insertHandler($element) {
    this.set('$handler', $element);
  }

  @action
  destroyHandler() {
    this.set('$handler', null);
  }
}
