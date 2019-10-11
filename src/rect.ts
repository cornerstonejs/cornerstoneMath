import lineSegment from './lineSegment';
import { Rect, Number2 } from './Interfaces';
import { Interval } from './interval';

function rectToLineSegments (rect: Rect): { start: Number2; end: Number2 }[] {
  const top = {
    start: { x: rect.left, y: rect.top },
    end: { x: rect.left + rect.width, y: rect.top }
  };
  const right = {
    start: { x: rect.left + rect.width, y: rect.top },
    end: { x: rect.left + rect.width, y: rect.top + rect.height }
  };
  const bottom = {
    start: { x: rect.left + rect.width, y: rect.top + rect.height },
    end: { x: rect.left, y: rect.top + rect.height }
  };
  const left = {
    start: { x: rect.left, y: rect.top + rect.height },
    end: { x: rect.left, y: rect.top }
  };
  const lineSegments = [top, right, bottom, left];

  return lineSegments;
}

function distanceToPoint (rect: Rect, point: Number2): number {
  let minDistance = 655535;
  const lineSegments = rectToLineSegments(rect);

  lineSegments.forEach(function (segment) {
    const distance = lineSegment.distanceToPoint(segment, point);

    if (distance < minDistance) {
      minDistance = distance;
    }
  });

  return minDistance;
}

// Returns top-left and bottom-right points of the rectangle
function rectToPoints (rect: Rect): { topLeft: Number2; bottomRight: Number2 } {
  const rectPoints = {
    topLeft: {
      x: rect.left,
      y: rect.top
    },
    bottomRight: {
      x: rect.left + rect.width,
      y: rect.top + rect.height
    }
  };

  return rectPoints;
}

// Returns whether two non-rotated rectangles are intersected
function doesIntersect (rect1: Rect, rect2: Rect): boolean {
  const intervalRect1H = new Interval(
    Math.min(rect1.left, rect1.left + rect1.width),
    Math.max(rect1.left, rect1.left + rect1.width)
  );
  const intervalRect1V = new Interval(
    Math.min(rect1.top, rect1.top + rect1.height),
    Math.max(rect1.top, rect1.top + rect1.height)
  );
  const intervalRect2H = new Interval(
    Math.min(rect2.left, rect2.left + rect2.width),
    Math.max(rect2.left, rect2.left + rect2.width)
  );
  const intervalRect2V = new Interval(
    Math.min(rect2.top, rect2.top + rect2.height),
    Math.max(rect2.top, rect2.top + rect2.height)
  );

  return intervalRect1H.doesIntersect(intervalRect2H) &&
  intervalRect1V.doesIntersect(intervalRect2V);
}

// Returns intersection points of two non-rotated rectangles
function getIntersectionRect (rect1: Rect, rect2: Rect): { topLeft: Number2; bottomRight: Number2 } | undefined {
  const intervalRect1H = new Interval(
    Math.min(rect1.left, rect1.left + rect1.width),
    Math.max(rect1.left, rect1.left + rect1.width)
  );
  const intervalRect1V = new Interval(
    Math.min(rect1.top, rect1.top + rect1.height),
    Math.max(rect1.top, rect1.top + rect1.height)
  );
  const intervalRect2H = new Interval(
    Math.min(rect2.left, rect2.left + rect2.width),
    Math.max(rect2.left, rect2.left + rect2.width)
  );
  const intervalRect2V = new Interval(
    Math.min(rect2.top, rect2.top + rect2.height),
    Math.max(rect2.top, rect2.top + rect2.height)
  );

  const intersectionH = intervalRect1H.getIntersection(intervalRect2H);
  const intersectionV = intervalRect1V.getIntersection(intervalRect2V);

  if (!intersectionH || !intersectionV) {
    return;
  }
  // Returns top-left and bottom-right points of intersected rectangle

  return {
    topLeft: { x: intersectionH.min, y: intersectionV.min },
    bottomRight: { x: intersectionH.max, y: intersectionV.max }
  };
}

const rect = {
  distanceToPoint,
  getIntersectionRect,
  rectToPoints,
  doesIntersect
};

export default rect;
