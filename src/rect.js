 import lineSegment from './lineSegment';

 function rectToLineSegments (rect) {
   const top = {
     start: {
       x: rect.left,
       y: rect.top
     },
     end: {
       x: rect.left + rect.width,
       y: rect.top

     }
   };
   const right = {
     start: {
       x: rect.left + rect.width,
       y: rect.top
     },
     end: {
       x: rect.left + rect.width,
       y: rect.top + rect.height

     }
   };
   const bottom = {
     start: {
       x: rect.left + rect.width,
       y: rect.top + rect.height
     },
     end: {
       x: rect.left,
       y: rect.top + rect.height

     }
   };
   const left = {
     start: {
       x: rect.left,
       y: rect.top + rect.height
     },
     end: {
       x: rect.left,
       y: rect.top

     }
   };
   const lineSegments = [top, right, bottom, left];


   return lineSegments;
 }

 function distanceToPoint (rect, point) {
   let minDistance = 655535;
   const lineSegments = rectToLineSegments(rect);

   lineSegments.forEach(function (segment) {
     const distance = lineSegment.distanceToPoint(segment, point);

     if(distance < minDistance) {
       minDistance = distance;
     }
   });

   return minDistance;
 }

// Returns top-left and bottom-right points of the rectangle
 function rectToPoints (rect) {
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
 function doesIntersect (rect1, rect2) {
   let intersectLeftRight;
   let intersectTopBottom;

   const rect1Points = rectToPoints(rect1);
   const rect2Points = rectToPoints(rect2);

   if (rect1.width >= 0) {
     if (rect2.width >= 0) {
       intersectLeftRight = !((rect1Points.bottomRight.x <= rect2Points.topLeft.x) || (rect2Points.bottomRight.x <= rect1Points.topLeft.x));
     } else {
       intersectLeftRight = !((rect1Points.bottomRight.x <= rect2Points.bottomRight.x) || (rect2Points.topLeft.x <= rect1Points.topLeft.x));
     }
   } else if (rect2.width >= 0) {
     intersectLeftRight = !((rect1Points.topLeft.x <= rect2Points.topLeft.x) || (rect2Points.bottomRight.x <= rect1Points.bottomRight.x));
   } else {
     intersectLeftRight = !((rect1Points.topLeft.x <= rect2Points.bottomRight.x) || (rect2Points.topLeft.x <= rect1Points.bottomRight.x));
   }

   if (rect1.height >= 0) {
     if (rect2.height >= 0) {
       intersectTopBottom = !((rect1Points.bottomRight.y <= rect2Points.topLeft.y) || (rect2Points.bottomRight.y <= rect1Points.topLeft.y));
     } else {
       intersectTopBottom = !((rect1Points.bottomRight.y <= rect2Points.bottomRight.y) || (rect2Points.topLeft.y <= rect1Points.topLeft.y));
     }
   } else if (rect2.height >= 0) {
     intersectTopBottom = !((rect1Points.topLeft.y <= rect2Points.topLeft.y) || (rect2Points.bottomRight.y <= rect1Points.bottomRight.y));
   } else {
     intersectTopBottom = !((rect1Points.topLeft.y <= rect2Points.bottomRight.y) || (rect2Points.top <= rect1Points.bottomRight.y));
   }

   return intersectLeftRight && intersectTopBottom;
 }

// Returns intersection points of two non-rotated rectangles
 function getIntersectionRect (rect1, rect2) {
   const intersectRect = {
     topLeft: {},
     bottomRight: {}
   };

   if (!doesIntersect(rect1, rect2)) {
     return;
   }

   const rect1Points = rectToPoints(rect1);
   const rect2Points = rectToPoints(rect2);

   if (rect1.width >= 0) {
     if (rect2.width >= 0) {
       intersectRect.topLeft.x = Math.max(rect1Points.topLeft.x, rect2Points.topLeft.x);
       intersectRect.bottomRight.x = Math.min(rect1Points.bottomRight.x, rect2Points.bottomRight.x);
     } else {
       intersectRect.topLeft.x = Math.max(rect1Points.topLeft.x, rect2Points.bottomRight.x);
       intersectRect.bottomRight.x = Math.min(rect1Points.bottomRight.x, rect2Points.topLeft.x);
     }
   } else if (rect2.width >= 0) {
     intersectRect.topLeft.x = Math.min(rect1Points.topLeft.x, rect2Points.bottomRight.x);
     intersectRect.bottomRight.x = Math.max(rect1Points.bottomRight.x, rect2Points.topLeft.x);
   } else {
     intersectRect.topLeft.x = Math.min(rect1Points.topLeft.x, rect2Points.topLeft.x);
     intersectRect.bottomRight.x = Math.max(rect1Points.bottomRight.x, rect2Points.bottomRight.x);
   }

   if (rect1.height >= 0) {
     if (rect2.height >= 0) {
       intersectRect.topLeft.y = Math.max(rect1Points.topLeft.y, rect2Points.topLeft.y);
       intersectRect.bottomRight.y = Math.min(rect1Points.bottomRight.y, rect2Points.bottomRight.y);
     } else {
       intersectRect.topLeft.y = Math.max(rect1Points.topLeft.y, rect2Points.bottomRight.y);
       intersectRect.bottomRight.y = Math.min(rect1Points.bottomRight.y, rect2Points.topLeft.y);
     }
   } else if (rect2.height >= 0) {
     intersectRect.topLeft.y = Math.min(rect1Points.topLeft.y, rect2Points.bottomRight.y);
     intersectRect.bottomRight.y = Math.max(rect1Points.bottomRight.y, rect2Points.topLeft.y);
   } else {
     intersectRect.topLeft.y = Math.min(rect1Points.topLeft.y, rect2Points.topLeft.y);
     intersectRect.bottomRight.y = Math.max(rect1Points.bottomRight.y, rect2Points.bottomRight.y);
   }

    // Returns top-left and bottom-right points of intersected rectangle
   return intersectRect;

 }

 const rect = {
   distanceToPoint,
   getIntersectionRect
 };

 export default rect;
