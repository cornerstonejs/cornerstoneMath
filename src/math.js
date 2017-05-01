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

export {
  clamp,
  degToRad,
  radToDeg,
  sign
};
