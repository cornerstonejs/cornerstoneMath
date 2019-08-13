import Quaternion from "./quaternion";
import { clamp } from "./math";
import Matrix4 from "./matrix4";
import { INumber3 } from "./Interfaces";

// Based on THREE.JS
class Vector3 implements INumber3 {
  x: number;
  y: number;
  z: number;

  constructor();
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setX(x: number) {
    this.x = x;
    return this;
  }

  setY(y: number) {
    this.y = y;
    return this;
  }

  setZ(z: number) {
    this.z = z;
    return this;
  }

  setComponent(index: number, value: number) {
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

  getComponent(index: number) {
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

  copy(v: INumber3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  add(v: INumber3, w?: INumber3) {
    if (w !== undefined) {
      console.warn(
        "DEPRECATED: Vector3's .add() now only accepts one argument. Use .addVectors( a, b ) instead."
      );
      return this.addVectors(v, w);
    }
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  addScalar(s: number) {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  }

  addVectors(a: INumber3, b: INumber3) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }

  sub(v: INumber3, w?: INumber3) {
    if (w !== undefined) {
      console.warn(
        "DEPRECATED: Vector3's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
      );
      return this.subVectors(v, w);
    }
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  subVectors(a: INumber3, b: INumber3) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  multiply(v: INumber3, w?: INumber3) {
    if (w !== undefined) {
      console.warn(
        "DEPRECATED: Vector3's .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."
      );
      return this.multiplyVectors(v, w);
    }
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  multiplyVectors(a: INumber3, b: INumber3) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    return this;
  }

  applyMatrix4(m: Matrix4) {
    let x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

    return this;
  }

  applyProjection(m: Matrix4) {
    let x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;
    const d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // Perspective divide

    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

    return this;
  }

  applyQuaternion(q: Quaternion) {
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

  transformDirection(m: Matrix4) {
    // Input: THREE.Matrix4 affine matrix
    // Vector interpreted as a direction

    let x = this.x,
      y = this.y,
      z = this.z;

    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    this.normalize();

    return this;
  }

  divide(v: INumber3) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }

  divideScalar(scalar: number) {
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

  min(v: INumber3) {
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

  max(v: INumber3) {
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

  clamp(a: INumber3, b: INumber3) {
    this.x = clamp(this.x, Math.min(a.x, b.x), Math.max(a.x, b.x));
    this.y = clamp(this.y, Math.min(a.y, b.y), Math.max(a.y, b.y));
    this.z = clamp(this.z, Math.min(a.z, b.z), Math.max(a.z, b.z));

    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  }

  roundToZero() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

    return this;
  }

  negate() {
    return this.multiplyScalar(-1);
  }

  dot(v: INumber3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  lengthManhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  normalize() {
    return this.divideScalar(this.length());
  }

  setLength(l: number) {
    const oldLength = this.length();

    if (oldLength !== 0 && l !== oldLength) {
      this.multiplyScalar(l / oldLength);
    }

    return this;
  }

  lerp(v: INumber3, alpha: number) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

    return this;
  }

  cross(v: INumber3, w?: INumber3) {
    if (w !== undefined) {
      console.warn(
        "DEPRECATED: Vector3's .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."
      );

      return this.crossVectors(v, w);
    }

    let x = this.x,
      y = this.y,
      z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  }

  crossVectors(a: INumber3, b: INumber3) {
    let ax = a.x,
      ay = a.y,
      az = a.z;
    let bx = b.x,
      by = b.y,
      bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  angleTo(v: Vector3) {
    const theta = this.dot(v) / (this.length() * v.length());

    // Clamp, to handle numerical problems

    return Math.acos(clamp(theta, -1, 1));
  }

  distanceTo(v: Vector3) {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v: INumber3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;
  }

  setFromMatrixPosition(m: Matrix4) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];

    return this;
  }

  setFromMatrixScale(m: Matrix4) {
    const sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
    const sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
    const sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();

    this.x = sx;
    this.y = sy;
    this.z = sz;

    return this;
  }

  setFromMatrixColumn(index: number, matrix: Matrix4) {
    const offset = index * 4;

    const me = matrix.elements;

    this.x = me[offset];
    this.y = me[offset + 1];
    this.z = me[offset + 2];

    return this;
  }

  equals(v: INumber3) {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }

  fromArray(array: number[]) {
    this.x = array[0];
    this.y = array[1];
    this.z = array[2];

    return this;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  projectOnVector(vector: Vector3) {
    const v1 = new Vector3();
    v1.copy(vector).normalize();
    const dot = this.dot(v1);
    return this.copy(v1).multiplyScalar(dot);
  }

  projectOnPlane(planeNormal: Vector3) {
    const v1 = new Vector3();
    v1.copy(this).projectOnVector(planeNormal);
    return this.sub(v1);
  }

  // Reflect incident vector off plane orthogonal to normal
  // Normal is assumed to have unit length
  reflect(normal: Vector3) {
    const v1 = new Vector3();
    return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }

  clampScalar(minVal: number, maxVal: number) {
    const min = new Vector3();
    const max = new Vector3();

    min.set(minVal, minVal, minVal);
    max.set(maxVal, maxVal, maxVal);

    return this.clamp(min, max);
  }

  applyAxisAngle(axis: Vector3, angle: number) {
    const quaternion = new Quaternion();
    this.applyQuaternion(quaternion.setFromAxisAngle(axis.normalize(), angle));
    return this;
  }
}

export default Vector3;
