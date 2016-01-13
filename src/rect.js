var cornerstoneMath = (function (cornerstoneMath) {

    "use strict";

    if(cornerstoneMath === undefined) {
        cornerstoneMath = {};
    }

    function rectToLineSegments(rect)
    {
        var top = {
            start : {
                x :rect.left,
                y :rect.top
            },
            end : {
                x :rect.left + rect.width,
                y :rect.top

            }
        };
        var right = {
            start : {
                x :rect.left + rect.width,
                y :rect.top
            },
            end : {
                x :rect.left + rect.width,
                y :rect.top + rect.height

            }
        };
        var bottom = {
            start : {
                x :rect.left + rect.width,
                y :rect.top + rect.height
            },
            end : {
                x :rect.left,
                y :rect.top + rect.height

            }
        };
        var left = {
            start : {
                x :rect.left,
                y :rect.top + rect.height
            },
            end : {
                x :rect.left,
                y :rect.top

            }
        };
        var lineSegments = [top, right, bottom, left];
        return lineSegments;
    }

    function pointNearLineSegment(point, lineSegment, maxDistance)
    {
        if(maxDistance === undefined) {
            maxDistance = 5;
        }
        var distance = cornerstoneMath.lineSegment.distanceToPoint(lineSegment, point);

        return (distance < maxDistance);
    }
    function distanceToPoint(rect, point)
    {
        var minDistance = 655535;
        var lineSegments = rectToLineSegments(rect);
        lineSegments.forEach(function(lineSegment) {
            var distance = cornerstoneMath.lineSegment.distanceToPoint(lineSegment, point);
            if(distance < minDistance) {
                minDistance = distance;
            }
        });
        return minDistance;
    }

    // Returns rectangle points
    function rectToPoints (rect) {
        var rectPoints = {
            top: rect.top,
            left: rect.left,
            right: rect.left + rect.width,
            bottom: rect.top + rect.height
        };

        return rectPoints;
    }

    // Returns whether two rectangles are intersected
    function doesIntersect (rect1, rect2) {
        var intersectLeftRight;
        var intersectTopBottom;

        var rect1Points = rectToPoints(rect1);
        var rect2Points = rectToPoints(rect2);

        if (rect1.width >= 0) {
            if (rect2.width >= 0)
                intersectLeftRight = !((rect1Points.right <= rect2Points.left) || (rect2Points.right <= rect1Points.left));
            else
                intersectLeftRight = !((rect1Points.right <= rect2Points.right) || (rect2Points.left <= rect1Points.left));
        } else {
            if (rect2.width >= 0)
                intersectLeftRight = !((rect1Points.left <= rect2Points.left) || (rect2Points.right <= rect1Points.right));
            else
                intersectLeftRight = !((rect1Points.left <= rect2Points.right) || (rect2Points.left <= rect1Points.right));
        }

        if (rect1.height >= 0) {
            if (rect2.height >= 0)
                intersectTopBottom = !((rect1Points.bottom <= rect2Points.top) || (rect2Points.bottom <= rect1Points.top));
            else
                intersectTopBottom = !((rect1Points.bottom <= rect2Points.bottom) || (rect2Points.top <= rect1Points.top));
        } else {
            if (rect2.height >= 0)
                intersectTopBottom = !((rect1Points.top <= rect2Points.top) || (rect2Points.bottom <= rect1Points.bottom));
            else
                intersectTopBottom = !((rect1Points.top <= rect2Points.bottom) || (rect2Points.top <= rect1Points.bottom));
        }

        return intersectLeftRight && intersectTopBottom;
    }

    // Returns intersection points of two rectangles
    function getIntersectionRect(rect1, rect2) {
        var intersectPoints = {};

        if (!doesIntersect(rect1, rect2)) {
            return;
        }

        var rect1Points = rectToPoints(rect1);
        var rect2Points = rectToPoints(rect2);

        if (rect1.width >= 0) {
            if (rect2.width >= 0) {
                intersectPoints.left = Math.max(rect1Points.left, rect2Points.left);
                intersectPoints.right = Math.min(rect1Points.right, rect2Points.right);
            } else {
                intersectPoints.left = Math.max(rect1Points.left, rect2Points.right);
                intersectPoints.right = Math.min(rect1Points.right, rect2Points.left);
            }
        } else {
            if (rect2.width >= 0) {
                intersectPoints.left = Math.min(rect1Points.left, rect2Points.right);
                intersectPoints.right = Math.max(rect1Points.right, rect2Points.left);
            } else {
                intersectPoints.left = Math.min(rect1Points.left, rect2Points.left);
                intersectPoints.right = Math.max(rect1Points.right, rect2Points.right);
            }
        }

        if (rect1.height >= 0) {
            if (rect2.height >= 0) {
                intersectPoints.top = Math.max(rect1Points.top, rect2Points.top);
                intersectPoints.bottom = Math.min(rect1Points.bottom, rect2Points.bottom);
            } else {
                intersectPoints.top = Math.max(rect1Points.top, rect2Points.bottom);
                intersectPoints.bottom = Math.min(rect1Points.bottom, rect2Points.top);
            }
        } else {
            if (rect2.height >= 0) {
                intersectPoints.top = Math.min(rect1Points.top, rect2Points.bottom);
                intersectPoints.bottom = Math.max(rect1Points.bottom, rect2Points.top);
            } else {
                intersectPoints.top = Math.min(rect1Points.top, rect2Points.top);
                intersectPoints.bottom = Math.max(rect1Points.bottom, rect2Points.bottom);
            }
        }

        return intersectPoints;

    }

    // module exports
    cornerstoneMath.rect =
    {
        distanceToPoint : distanceToPoint,
        getIntersectionRect : getIntersectionRect

    };


    return cornerstoneMath;
}(cornerstoneMath));