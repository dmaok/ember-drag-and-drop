import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/spacer';

export default class Spacer extends Component {
  classNames = ['ember-dnd__spacer'];
  classNameBindings = ['isHidden:is-hidden'];

  layout = layout
}
