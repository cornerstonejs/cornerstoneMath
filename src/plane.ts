import Vector3 from "./vector3";
import Line3 from "./Line3";
import { INumber3 } from "./Interfaces";

// Copied from Three.JS
/**
 * @author bhouston / http://exocortex.com
 */

class Plane {
  normal: Vector3;
  constant: number;

  constructor(obj?: { normal: Vector3; constant: number }) {
    this.normal = obj ? obj.normal : new Vector3(1, 0, 0);
    this.constant = obj ? obj.constant : 0;
  }

  set(normal: Vector3, constant: number) {
    this.normal.copy(normal);
    this.constant = constant;

    return this;
  }

  setComponents(x: number, y: number, z: number, w: number) {
    this.normal.set(x, y, z);
    this.constant = w;

    return this;
  }

  setFromNormalAndCoplanarPoint(normal: INumber3, point: INumber3) {
    this.normal.copy(normal);
    // Must be this.normal, not normal, as this.normal is normalized
    this.constant = -this.normal.dot(point);

    return this;
  }

  copy(plane: Plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  }

  normalize() {
    // Note: will lead to a divide by zero if the plane is invalid.

    const inverseNormalLength = 1.0 / this.normal.length();

    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;

    return this;
  }

  negate() {
    this.constant *= -1;
    this.normal.negate();

    return this;
  }

  distanceToPoint(point: INumber3) {
    return this.normal.dot(point) + this.constant;
  }

  distanceToSphere(sphere: { center: INumber3; radius: number }) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }

  projectPoint(point: INumber3, optionalTarget: Vector3 = new Vector3()) {
    return this.orthoPoint(point, optionalTarget)
      .sub(point)
      .negate();
  }

  orthoPoint(point: INumber3, optionalTarget: Vector3 = new Vector3()) {
    const perpendicularMagnitude = this.distanceToPoint(point);
    return optionalTarget
      .copy(this.normal)
      .multiplyScalar(perpendicularMagnitude);
  }

  isIntersectionLine(line: Line3) {
    // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

    const startSign = this.distanceToPoint(line.start);
    const endSign = this.distanceToPoint(line.end);

    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
  }

  intersectPlane(targetPlane: Plane) {
    // Returns the intersection line between two planes
    const direction = this.normal.clone().cross(targetPlane.normal);
    const origin = new Vector3();
    const intersectionData = {
      origin,
      direction
    };

    // If the planes are parallel, return an empty vector for the intersection line
    if (
      this.normal
        .clone()
        .cross(targetPlane.normal)
        .length() < 1e-10
    ) {
      intersectionData.direction = new Vector3();

      return intersectionData;
    }

    const h1 = this.constant;
    const h2 = targetPlane.constant;
    const n1dotn2 = this.normal.clone().dot(targetPlane.normal);

    const c1 = -(h1 - h2 * n1dotn2) / (1 - n1dotn2 * n1dotn2);
    const c2 = -(h2 - h1 * n1dotn2) / (1 - n1dotn2 * n1dotn2);

    intersectionData.origin = this.normal
      .clone()
      .multiplyScalar(c1)
      .add(targetPlane.normal.clone().multiplyScalar(c2));

    return intersectionData;
  }

  coplanarPoint(optionalTarget: Vector3 = new Vector3()) {
    return optionalTarget.copy(this.normal).multiplyScalar(-this.constant);
  }

  translate(offset: Vector3) {
    this.constant = this.constant - offset.dot(this.normal);
    return this;
  }

  equals(plane: Plane) {
    return plane.normal.equals(this.normal) && plane.constant === this.constant;
  }

  clone() {
    return new Plane().copy(this);
  }

  setFromCoplanarPoints(a: INumber3, b: INumber3, c: INumber3) {
    const v1 = new Vector3();
    const v2 = new Vector3();
    const normal = v1
      .subVectors(c, b)
      .cross(v2.subVectors(a, b))
      .normalize();
    // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?
    this.setFromNormalAndCoplanarPoint(normal, a);
    return this;
  }

  intersectLine(line: Line3, optionalTarget: Vector3 = new Vector3()) {
    const v1 = new Vector3();

    const direction = line.delta(v1);

    const denominator = this.normal.dot(direction);

    if (denominator === 0) {
      // Line is coplanar, return origin
      if (this.distanceToPoint(line.start) === 0) {
        return optionalTarget.copy(line.start);
      }

      // Unsure if this is the correct method to handle this case.
      return undefined;
    }

    const t = -(line.start.dot(this.normal) + this.constant) / denominator;

    if (t < 0 || t > 1) {
      return undefined;
    }

    return optionalTarget
      .copy(direction)
      .multiplyScalar(t)
      .add(line.start);
  }
}

export default Plane;
