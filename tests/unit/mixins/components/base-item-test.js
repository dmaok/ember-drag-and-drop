import EmberObject from '@ember/object';
import ComponentsBaseItemMixin from 'ember-drag-and-drop/mixins/components/base-item';
import { module, test } from 'qunit';

module('Unit | Mixin | components/base item');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsBaseItemObject = EmberObject.extend(ComponentsBaseItemMixin);
  let subject = ComponentsBaseItemObject.create();
  assert.ok(subject);
});
