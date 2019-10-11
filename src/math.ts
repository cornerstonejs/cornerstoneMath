// Based on THREE.JS
function clamp (x: number, a: number, b: number): number {
  return x < a ? a : x > b ? b : x;
}

function degToRad (degrees: number): number {
  const degreeToRadiansFactor = Math.PI / 180;

  return degrees * degreeToRadiansFactor;
}

function radToDeg (radians: number): number {
  const radianToDegreesFactor = 180 / Math.PI;

  return radians * radianToDegreesFactor;
}

// Returns sign of number
function sign (x: number): 0 | 1 | -1 {
  return x === 0 ? 0 : x > 0 ? 1 : -1;
}

export { clamp, degToRad, radToDeg, sign };
