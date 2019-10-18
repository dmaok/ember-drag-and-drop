import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/handler';

export default class Handler extends Component {
  classNames = ['ember-dnd__handler'];

  didInsertElement() {
    super.didInsertElement(...arguments);

    this.insert(this.element);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this.destroy();
  }

  layout = layout;
}
