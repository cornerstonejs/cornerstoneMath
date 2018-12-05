import { default as Line3 } from './Line3.js';
import { default as lineSegment } from './lineSegment.js';
import { clamp,
  degToRad,
  radToDeg,
  sign } from './math.js';

import { default as Matrix4 } from './matrix4.js';
import { default as Plane } from './plane.js';
import { default as point } from './point.js';
import { default as quaternion } from './quaternion.js';
import { default as rect } from './rect.js';
import { default as Vector3 } from './vector3.js';

const cornerstoneMath = {
  Line3,
  lineSegment,
  clamp,
  degToRad,
  radToDeg,
  sign,
  Matrix4,
  Plane,
  point,
  quaternion,
  rect,
  Vector3
};

export {
  Line3,
  lineSegment,
  clamp,
  degToRad,
  radToDeg,
  sign,
  Matrix4,
  Plane,
  point,
  quaternion,
  rect,
  Vector3
};

export default cornerstoneMath;
