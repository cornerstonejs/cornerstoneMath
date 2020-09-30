const EPSILON = 0.0001;
// Based on THREE.JS
function clamp (x, a, b) {
  return (x < a) ? a : ((x > b) ? b : x);
}

function degToRad (degrees) {
  const degreeToRadiansFactor = Math.PI / 180;


  return degrees * degreeToRadiansFactor;
}

function radToDeg (radians) {
  const radianToDegreesFactor = 180 / Math.PI;


  return radians * radianToDegreesFactor;
}

// Returns sign of number
function sign (x) {
  return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}


/**
 * 
 * Compare if two numbers are equal(if they have approximately the same value). to prevent js float precision issue
 * Adapted from glmatrix
 * @param {number} a
 * @param {number} b
 * @param {number} epsilon Precision to define proximity
 * @return {boolean} check whether or not the arguments have approximately the same value
 * 
 */
function approximatelyEquals (a, b, epsilon) {
  const _epsilon = epsilon || EPSILON;
  return Math.abs(a - b) <= _epsilon*Math.max(1.0, Math.abs(a), Math.abs(b));
}

export {
  clamp,
  degToRad,
  approximatelyEquals,
  radToDeg,
  sign
};
