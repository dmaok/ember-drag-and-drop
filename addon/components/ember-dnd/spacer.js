import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/spacer';

export default Component.extend({
  classNames: ['ember-dnd__spacer'],
  classNameBindings: ['isHidden:is-hidden'],

  layout
});
