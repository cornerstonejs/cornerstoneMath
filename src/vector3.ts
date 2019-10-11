import Quaternion from './quaternion';
import { clamp } from './math';
import Matrix4 from './matrix4';
import { Number3 } from './Interfaces';

// Based on THREE.JS
class Vector3 implements Number3 {
  x: number;
  y: number;
  z: number;

  constructor();
  constructor(x: number, y: number, z: number);
  constructor (x?: number, y?: number, z?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  set (x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  setX (x: number): this {
    this.x = x;

    return this;
  }

  setY (y: number): this {
    this.y = y;

    return this;
  }

  setZ (z: number): this {
    this.z = z;

    return this;
  }

  setComponent (index: number, value: number): void {
    switch (index) {
    case 0:
      this.x = value;
      break;
    case 1:
      this.y = value;
      break;
    case 2:
      this.z = value;
      break;
    default:
      throw new Error(`index is out of range: ${index}`);
    }
  }

  getComponent (index: number): number {
    switch (index) {
    case 0:
      return this.x;
    case 1:
      return this.y;
    case 2:
      return this.z;
    default:
      throw new Error(`index is out of range: ${index}`);
    }
  }

  copy (v: Number3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  add (v: Number3, w?: Number3): this {
    if (w !== undefined) {
      console.warn(
        'DEPRECATED: Vector3\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.'
      );

      return this.addVectors(v, w);
    }
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  addScalar (s: number): this {
    this.x += s;
    this.y += s;
    this.z += s;

    return this;
  }

  addVectors (a: Number3, b: Number3): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;

    return this;
  }

  sub (v: Number3, w?: Number3): this {
    if (w !== undefined) {
      console.warn(
        'DEPRECATED: Vector3\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.'
      );

      return this.subVectors(v, w);
    }
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  subVectors (a: Number3, b: Number3): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;
  }

  multiply (v: Number3, w?: Number3): this {
    if (w !== undefined) {
      console.warn(
        'DEPRECATED: Vector3\'s .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.'
      );

      return this.multiplyVectors(v, w);
    }
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  multiplyScalar (scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  multiplyVectors (a: Number3, b: Number3): this {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;
  }

  applyMatrix4 (m: Matrix4): this {
    const x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

    return this;
  }

  applyProjection (m: Matrix4): this {
    const x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;
    const d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // Perspective divide

    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

    return this;
  }

  applyQuaternion (q: Quaternion): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;

    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;

    // Calculate quat * vector

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // Calculate result * inverse quat

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  }

  transformDirection (m: Matrix4): this {
    // Input: THREE.Matrix4 affine matrix
    // Vector interpreted as a direction

    const x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    this.normalize();

    return this;
  }

  divide (v: Number3): this {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  }

  divideScalar (scalar: number): this {
    if (scalar !== 0) {
      const invScalar = 1 / scalar;

      this.x *= invScalar;
      this.y *= invScalar;
      this.z *= invScalar;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  }

  min (v: Number3): this {
    if (this.x > v.x) {
      this.x = v.x;
    }
    if (this.y > v.y) {
      this.y = v.y;
    }
    if (this.z > v.z) {
      this.z = v.z;
    }

    return this;
  }

  max (v: Number3): this {
    if (this.x < v.x) {
      this.x = v.x;
    }

    if (this.y < v.y) {
      this.y = v.y;
    }

    if (this.z < v.z) {
      this.z = v.z;
    }

    return this;
  }

  clamp (a: Number3, b: Number3): this {
    this.x = clamp(this.x, Math.min(a.x, b.x), Math.max(a.x, b.x));
    this.y = clamp(this.y, Math.min(a.y, b.y), Math.max(a.y, b.y));
    this.z = clamp(this.z, Math.min(a.z, b.z), Math.max(a.z, b.z));

    return this;
  }

  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  }

  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  }

  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  }

  roundToZero (): this {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

    return this;
  }

  negate (): this {
    return this.multiplyScalar(-1);
  }

  dot (v: Number3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  lengthSq (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length (): number {
    return Math.sqrt(this.lengthSq());
  }

  lengthManhattan (): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  normalize (): this {
    return this.divideScalar(this.length());
  }

  setLength (l: number): this {
    const oldLength = this.length();

    if (oldLength !== 0 && l !== oldLength) {
      this.multiplyScalar(l / oldLength);
    }

    return this;
  }

  lerp (v: Number3, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

    return this;
  }

  cross (v: Number3, w?: Number3): this {
    if (w !== undefined) {
      console.warn(
        'DEPRECATED: Vector3\'s .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.'
      );

      return this.crossVectors(v, w);
    }

    const x = this.x,
      y = this.y,
      z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  }

  crossVectors (a: Number3, b: Number3): this {
    const ax = a.x,
      ay = a.y,
      az = a.z;
    const bx = b.x,
      by = b.y,
      bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  angleTo (v: Vector3): number {
    const theta = this.dot(v) / (this.length() * v.length());

    // Clamp, to handle numerical problems

    return Math.acos(clamp(theta, -1, 1));
  }

  distanceTo (v: Vector3): number {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared (v: Number3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;
  }

  setFromMatrixPosition (m: Matrix4): this {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];

    return this;
  }

  setFromMatrixScale (m: Matrix4): this {
    const sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
    const sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
    const sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();

    this.x = sx;
    this.y = sy;
    this.z = sz;

    return this;
  }

  setFromMatrixColumn (index: number, matrix: Matrix4): this {
    const offset = index * 4;

    const me = matrix.elements;

    this.x = me[offset];
    this.y = me[offset + 1];
    this.z = me[offset + 2];

    return this;
  }

  equals (v: Number3): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }

  fromArray (array: number[]): this {
    this.x = array[0];
    this.y = array[1];
    this.z = array[2];

    return this;
  }

  toArray (): number[] {
    return [this.x, this.y, this.z];
  }

  clone (): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  projectOnVector (vector: Vector3): this {
    const v1 = new Vector3();

    v1.copy(vector).normalize();
    const dot = this.dot(v1);


    return this.copy(v1).multiplyScalar(dot);
  }

  projectOnPlane (planeNormal: Vector3): this {
    const v1 = new Vector3();

    v1.copy(this).projectOnVector(planeNormal);

    return this.sub(v1);
  }

  // Reflect incident vector off plane orthogonal to normal
  // Normal is assumed to have unit length
  reflect (normal: Vector3): this {
    const v1 = new Vector3();

    return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }

  clampScalar (minVal: number, maxVal: number): this {
    const min = new Vector3();
    const max = new Vector3();

    min.set(minVal, minVal, minVal);
    max.set(maxVal, maxVal, maxVal);

    return this.clamp(min, max);
  }

  applyAxisAngle (axis: Vector3, angle: number): this {
    const quaternion = new Quaternion();

    this.applyQuaternion(quaternion.setFromAxisAngle(axis.normalize(), angle));

    return this;
  }
}

export default Vector3;
