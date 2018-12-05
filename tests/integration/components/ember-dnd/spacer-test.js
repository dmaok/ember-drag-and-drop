import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-dnd/spacer', 'Integration | Component | ember dnd/spacer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-dnd/spacer}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-dnd/spacer}}
      template block text
    {{/ember-dnd/spacer}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
