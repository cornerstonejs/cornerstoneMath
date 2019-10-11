import { Number2, Rect } from './Interfaces';

function pageToPoint (e: { pageX: number; pageY: number }): Number2 {
  return {
    x: e.pageX,
    y: e.pageY
  };
}

function subtract (lhs: Number2, rhs: Number2): Number2 {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y
  };
}

function copy (point: Number2): Number2 {
  return {
    x: point.x,
    y: point.y
  };
}

function distanceSquared (from: Number2, to: Number2): number {
  const delta = subtract(from, to);

  return delta.x * delta.x + delta.y * delta.y;
}

function distance (from: Number2, to: Number2): number {
  return Math.sqrt(distanceSquared(from, to));
}

function insideRect (point: Number2, rect: Rect): boolean {
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
function findClosestPoint (sources: Number2[], target: Number2): Number2 | undefined {
  // Raw code is not good, refactor that
  let result: Number2 | undefined;

  let minDistanceSquared: number = Number.MAX_VALUE;

  for (const source of sources) {
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
