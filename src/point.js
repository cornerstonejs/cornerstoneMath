function pageToPoint (e) {
  return {
    x: e.pageX,
    y: e.pageY
  };
}

function subtract (lhs, rhs) {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y
  };
}

function copy (point) {
  return {
    x: point.x,
    y: point.y
  };
}

function distance (from, to) {
  return Math.sqrt(distanceSquared(from, to));
}

function distanceSquared (from, to) {
  const delta = subtract(from, to);


  return delta.x * delta.x + delta.y * delta.y;
}

function insideRect (point, rect) {
  if(point.x < rect.left ||
        point.x > rect.left + rect.width ||
        point.y < rect.top ||
        point.y > rect.top + rect.height) {
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
function findClosestPoint (sources, target) {
  const distances = [];
  let minDistance;

  sources.forEach(function (source, index) {
    const d = distance(source, target);

    distances.push(d);

    if (index === 0) {
      minDistance = d;
    } else {
      minDistance = Math.min(d, minDistance);
    }
  });

  const index = distances.indexOf(minDistance);


  return sources[index];
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
