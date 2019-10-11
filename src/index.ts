import { default as Line3 } from './Line3';
import { default as lineSegment } from './lineSegment';
import { clamp, degToRad, radToDeg, sign } from './math';

import { default as Matrix4 } from './matrix4';
import { default as Plane } from './plane';
import { default as point } from './point';
import { default as quaternion } from './quaternion';
import { default as rect } from './rect';
import { default as Vector3 } from './vector3';

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
