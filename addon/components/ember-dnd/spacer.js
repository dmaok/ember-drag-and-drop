import Component from '@ember/component';
import layout from '../../templates/components/ember-dnd/spacer';
import BaseItem from 'ember-drag-and-drop/mixins/components/base-item';

export default Component.extend(BaseItem, {
  name: 'spacer',

  layout
});
