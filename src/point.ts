import { INumber2, IRect } from './Interfaces';

function pageToPoint (e: { pageX: number; pageY: number }) {
  return {
    x: e.pageX,
    y: e.pageY
  };
}

function subtract (lhs: INumber2, rhs: INumber2) {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y
  };
}

function copy (point: INumber2) {
  return {
    x: point.x,
    y: point.y
  };
}

function distance (from: INumber2, to: INumber2) {
  return Math.sqrt(distanceSquared(from, to));
}

function distanceSquared (from: INumber2, to: INumber2) {
  const delta = subtract(from, to);

  return delta.x * delta.x + delta.y * delta.y;
}

function insideRect (point: INumber2, rect: IRect) {
  if (
    point.x < rect.left ||
    point.x > rect.left + rect.width ||
    point.y < rect.top ||
    point.y > rect.top + rect.height
  ) {
    return false;
  }

  return true;
}

/**
 * Returns the closest source point to a target point
 * given an array of source points.
 *
 * @param sources An Array of source Points
 * @param target The target Point
 * @returns Point The closest point from the points array
 */
function findClosestPoint (sources: INumber2[], target: INumber2) {
  // Raw code is not good, refactor that
  let result: INumber2 | undefined;

  let minDistanceSquared: number = Number.MAX_VALUE;

  for (let source of sources) {
    const d = distanceSquared(source, target);

    if (!result || d < minDistanceSquared) {
      result = source;
      minDistanceSquared = d;
    }
  }

  return result;
}

const point = {
  subtract,
  copy,
  pageToPoint,
  distance,
  distanceSquared,
  insideRect,
  findClosestPoint
};

export default point;
