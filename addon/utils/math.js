export default function math() {
  return true;
}

/**
 * [intersect description]
 * @param  {object} e1 [description]
 * @param  {object} e2 [description]
 * @return {boolean}    [description]
 */
export const intersect = (e1, e2) => {

  //First rectangle
  const e1_x1 = e1.x,
    e1_y1 = e1.y,
    e1_x2 = e1.x + e1.width,
    e1_y2 = e1.y + e1.height;

  //Second rectangle
  const e2_x1 = e2.x,
    e2_y1 = e2.y, e2_x2 = e2.x + e2.width,
    e2_y2 = e2.y + e2.height;

  return !(e2_x1 > e1_x2 || e2_x2 < e1_x1 || e2_y1 > e1_y2 || e2_y2 < e1_y1);
};

export const calculateRectanglesWrapRectangle = (rectangles = []) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  rectangles.forEach((rectangle, i) => {
    const
      minRectX = Math.min(...rectangle.map(({ x }) => x)),
      minRectY = Math.min(...rectangle.map(({ y }) => y)),
      maxRectX = Math.max(...rectangle.map(({ x }) => x)),
      maxRectY = Math.max(...rectangle.map(({ y }) => y));

    if (i === 0) {
      x1 = minRectX;
      y1 = minRectY;
      x2 = maxRectX;
      y2 = maxRectY;
      return;
    }

    if (minRectX < x1) x1 = minRectX;
    if (minRectY < y1) y1 = minRectY;
    if (maxRectX > x2) x2 = maxRectX;
    if (maxRectY > y2) y2 = maxRectY;
  });

  return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }, { x: x1, y: y2 }];
};

export const getRectangleFromCss = ({ x = 0, y = 0, width = 0, height = 0 }) => {
  return [{
    x,
    y
  }, {
    x: x + width,
    y
  }, {
    x: x + width,
    y: y + height
  }, {
    x,
    y: y + height
  }];
};

export const getCssFromRectangle = (rectangle = []) => {
  const
    a = rectangle[0],
    c = rectangle[2];

  return {
    x: a.x,
    y: a.y,
    width: Math.abs(c.x - a.x),
    height: Math.abs(c.y - a.y),
  };
};

export const calculateOverlapArea = (r1, r2) => {
  const
    rectangle1 = {
      left: r1[0].x,
      right: r1[1].x,
      top: r1[0].y,
      bottom: r1[2].y,
    },
    rectangle2 = {
      left: r2[0].x,
      right: r2[1].x,
      top: r2[0].y,
      bottom: r2[2].y,
    };

  const xOverlap = Math.max(0, Math.min(rectangle1.right, rectangle2.right) - Math.max(rectangle1.left, rectangle2.left));
  const yOverlap = Math.max(0, Math.min(rectangle1.bottom, rectangle2.bottom) - Math.max(rectangle1.top, rectangle2.top));

  return xOverlap * yOverlap;
};
