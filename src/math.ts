// Based on THREE.JS
function clamp<T extends number>(x: T, a: T, b: T) {
  return x < a ? a : x > b ? b : x;
}

function degToRad(degrees: number) {
  const degreeToRadiansFactor = Math.PI / 180;

  return degrees * degreeToRadiansFactor;
}

function radToDeg(radians: number) {
  const radianToDegreesFactor = 180 / Math.PI;

  return radians * radianToDegreesFactor;
}

// Returns sign of number
function sign(x: number) {
  return x === 0 ? 0 : x > 0 ? 1 : -1;
}

export { clamp, degToRad, radToDeg, sign };
