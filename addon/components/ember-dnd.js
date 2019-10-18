import Component from '@ember/component';
import {A} from '@ember/array';
import { observes } from '@ember-decorators/object';
import EmberObject, { action } from '@ember/object';
import { bool, not } from '@ember/object/computed';
import {once} from '@ember/runloop';
import {calculateOverlapArea, getRectangleFromCss, intersect} from '../utils/math';
import layout from '../templates/components/ember-dnd';
import jQuery from 'jquery';

export default class EmberDnd extends Component {
  classNames = ['ember-dnd'];
  classNameBindings = ['isDragState:is-drag-state'];
  latency = 100;
  transitionTime = 200;
  draggableItem = EmberObject.create();

  @bool('draggableItem') isDragState;
  @not('isDragState') isNotDragState;

  init() {
    super.init(...arguments);

    this.set('items', A());
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    this.set('$spacer', jQuery(this.element.querySelector('.ember-dnd__spacer')));
  }

  @observes('matrix.@each.x', 'matrix.@each.y', 'draggableItem.x', 'draggableItem.y')
  _applyStylesObserver() {
    const
      matrix = this.get('matrix'),
      draggableItem = this.get('draggableItem');

    if (!matrix) return;

    const allItems = [...matrix, draggableItem];

    allItems.forEach(item => {
      const {
        isSpacer,
        x, y,
        initialX, initialY
      } = item.getProperties('x', 'y', 'initialX', 'initialY', 'isSpacer', '$element');

      const css = {
        transform: `translate3d(${x - initialX}px, ${y - initialY}px, 0)`,
        zIndex: 2,
        position: 'relative'
      };

      if (isSpacer) {
        const $draggableElement = draggableItem.get('$element');

        Object.assign(css, {
          width: item.get('width'),
          height: item.get('height'),
          zIndex: 1,
          transform: `translate3d(
            ${x + parseInt($draggableElement.css('margin-left')) + (this.get('calculatePadding') ? parseInt($draggableElement.css('padding-left')) : 0)}px, 
            ${y + parseInt($draggableElement.css('margin-top')) + (this.get('calculatePadding') ? parseInt($draggableElement.css('padding-top')) : 0)}px,
             0)
          `
        });

      }

      if (item === draggableItem) {
        css.zIndex = 3;
        css.transform += ' scale(1.02)';
      }

      item.get('$element').css(css);
    });
  }

  initDrag(draggableComponent) {
    const
      items = this.get('items'),
      matrix = A([]);

    let draggableItem;

    items.forEach(item => {
      const
        isDraggableItem = draggableComponent === item,
        order = item.get('model.order'),
        $element = jQuery(item.element),
        {left: x, top: y} = $element.position(),
        width = $element.width(),
        height = $element.height(),
        object = {
          $element,
          initialOrder: order,
          order,
          x,
          y,
          width,
          height,
          itemSrc: item
        };

      if (isDraggableItem) {
        const DraggableItem = EmberObject.extend(object);
        draggableItem = DraggableItem.create();

        matrix.addObject(
          EmberObject.extend( object, {
            $element: this.get('$spacer'),
            isSpacer: true
          }).create()
        );
      } else {
        matrix.addObject(EmberObject.extend(object).create());
      }
    });

    const {minX, minY} = matrix.reduce((result, item) => {
      const
        {minX, minY} = result,
        {x, y} = item.getProperties('x', 'y');
      result.minX = minX ? Math.min(minX, x) : x;
      result.minY = minY ? Math.min(minY, y) : y;

      return result;
    }, {});

    [...matrix, draggableItem].forEach(item => {
      item.initialX = item.x -= minX;
      item.initialY = item.y -= minY;
    });

    this.setProperties({
      draggableItem,
      matrix
    });
  }

  stopDrag() {
    const draggableItem = this.get('draggableItem');
    if (!draggableItem) return;

    once(() => {
      let spacer = (this.get('matrix') || []).find(item => item.get('isSpacer'));

      draggableItem.setProperties({
        x: spacer.get('x'),
        y: spacer.get('y')
      });

      [...this.get('matrix'), this.get('draggableItem')].forEach(item => {
        if (item.get('isSpacer')) {
          return;
        }

        const
          model = item.get('itemSrc.model'),
          $element = item.get('$element');

        $element.css('transition', 'all 0s');
        renderFixStep();
        $element.css('transform', 'none');

        // renderFixStep();

        model && model.set('order', item.get('order'));

        setTimeout(() => {
          $element.removeAttr('style');
        }, 0);
      });

      this.set('matrix', null);
      this.set('draggableItem', null);
    });
  }

  @action
  insertItem(item) {
    this.get('items').addObject(item);
  }

  @action
  destroyItem(item) {
    this.get('items').removeObject(item);
  }

  @action
  onDragStart(item) {
    this.initDrag(item);
  }

  @action
  onDrag({distance}) {
    window.clearTimeout(this.get('_dragTimeOut'));

    const
      matrix = this.get('matrix'),
      draggableItem = this.get('draggableItem'),
      [x, y] = distance;

    if (!draggableItem) return;

    const
      {initialX, initialY} = draggableItem.getProperties('initialX', 'initialY'),
      newX = initialX + x,
      newY = initialY + y;

    draggableItem.setProperties({
      x: newX,
      y: newY
    });

    if (this.get('_locked')) return;

    this.set('_dragTimeOut', setTimeout(() => {
      let spacer;

      const
        draggablePositionPlainObject = draggableItem.getProperties('x', 'y', 'width', 'height'),
        draggableRectangle = getRectangleFromCss(draggablePositionPlainObject),
        allTargets = matrix
          .reduce((result, item) => {
            if (item.get('isSpacer')) {
              spacer = item;
            }

            const
              positionObject = item.getProperties('x', 'y', 'width', 'height'),
              rectangle = getRectangleFromCss(positionObject),
              overlapSquare = calculateOverlapArea(rectangle, draggableRectangle),
              rectangleSquare = positionObject.width * positionObject.height,
              overlapToRectangleRatio = overlapSquare / rectangleSquare;

            if (intersect(draggablePositionPlainObject, positionObject) && overlapToRectangleRatio > .1) {
              result.push({
                item,
                overlapSquare
              });
            }

            return result;
          }, [])
          .sort(({overlapSquare: square1}, {overlapSquare: square2}) => {
            return square2 - square1;
          });

      if (!allTargets.length) return;

      const
        maxOverlap = Math.max(...allTargets.map(({overlapSquare}) => overlapSquare)),
        targets = allTargets.reduce((result, {overlapSquare, item}) => {

          if (overlapSquare / maxOverlap > .3) {
            result.push(item);
          }

          return result;
        }, []),
        draggableOrder = draggableItem.get('order'),
        target = (() => {
          let
            predictedTarget = targets[0],
            predictedTargetOrder = predictedTarget && predictedTarget.get('order'),
            targetsWithoutSpacer = targets.filter(target => !target.get('isSpacer'));

          if (predictedTarget === spacer) return;

          //if two targets is near - take closest to draggableOrder and by square of overlay
          if (targetsWithoutSpacer.length > 1) {
            for (let i = 1; i < targetsWithoutSpacer.length; i++) {
              const
                secondTarget = targetsWithoutSpacer[i],
                secondOrder = secondTarget.get('order');

              if (Math.abs(predictedTargetOrder - secondOrder) === 1) {
                if (Math.abs(draggableOrder - secondOrder) < Math.abs(draggableOrder - predictedTargetOrder)) return secondTarget;
              }
            }
          }

          //else - take biggest by square of overlay
          return predictedTarget;
        })();

      if (!target) return;

      const
        targetOrder = target.get('order'),
        direction = targetOrder > draggableOrder ? -1 : 1;

      this.set('_locked', true);
      setTimeout(() => {
        this.set('_locked', false);
      }, this.get('transitionTime'));

      once(() => {
        const toApply = [];

        for (let i = targetOrder; i !== draggableOrder; i += direction) {
          const
            item = matrix.find(item => item.get('order') === i),
            nextOrder = i + direction,
            nextItem = matrix.find(item => item.get('order') === nextOrder);

          toApply.push({
            item,
            x: nextItem.get('x'),
            y: nextItem.get('y'),
            order: nextOrder
          });
        }

        draggableItem.setProperties({
          order: targetOrder
        });

        spacer.setProperties({
          order: targetOrder,
          x: target.get('x'),
          y: target.get('y')
        });

        toApply.forEach(({item, x, y, order}) => {
          item.setProperties({x, y, order});
        });
      });
    }, this.get('latency')));
  }

  @action
  onDragEnd() {
    this.stopDrag();
  }

  layout = layout;
}

const renderFixStep = () => document.body.offsetHeight;
