import Vector3 from './vector3.js';

// Copied from Three.JS
/**
 * @author bhouston / http://exocortex.com
 */

class Plane {
  constructor (normal, constant) {

    this.normal = (normal !== undefined) ? normal : new Vector3(1, 0, 0);
    this.constant = (constant !== undefined) ? constant : 0;

  }

  set (normal, constant) {

    this.normal.copy(normal);
    this.constant = constant;

    return this;

  }

  setComponents (x, y, z, w) {

    this.normal.set(x, y, z);
    this.constant = w;

    return this;

  }

  setFromNormalAndCoplanarPoint (normal, point) {

    this.normal.copy(normal);
    // Must be this.normal, not normal, as this.normal is normalized
    this.constant = -point.dot(this.normal);

    return this;

  }

  copy (plane) {

    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;

  }

  normalize () {

    // Note: will lead to a divide by zero if the plane is invalid.

    const inverseNormalLength = 1.0 / this.normal.length();

    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;

    return this;

  }

  negate () {

    this.constant *= -1;
    this.normal.negate();

    return this;

  }

  distanceToPoint (point) {

    return this.normal.dot(point) + this.constant;

  }

  distanceToSphere (sphere) {

    return this.distanceToPoint(sphere.center) - sphere.radius;

  }

  projectPoint (point, optionalTarget) {

    return this.orthoPoint(point, optionalTarget).sub(point).negate();

  }

  orthoPoint (point, optionalTarget) {

    const perpendicularMagnitude = this.distanceToPoint(point);

    const result = optionalTarget || new Vector3();


    return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);

  }

  isIntersectionLine (line) {

    // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

    const startSign = this.distanceToPoint(line.start);
    const endSign = this.distanceToPoint(line.end);

    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);

  }

  intersectPlane (targetPlane) {
    // Returns the intersection line between two planes
    const direction = this.normal.clone().cross(targetPlane.normal);
    const origin = new Vector3();
    const intersectionData = {
      origin,
      direction
    };

    // If the planes are parallel, return an empty vector for the intersection line
    if (this.normal.clone().cross(targetPlane.normal).length < 1e-10) {
      intersectionData.direction = new Vector3();

      return intersectionData;
    }

    const h1 = this.constant;
    const h2 = targetPlane.constant;
    const n1dotn2 = this.normal.clone().dot(targetPlane.normal);

    const c1 = -(h1 - h2 * n1dotn2) / (1 - n1dotn2 * n1dotn2);
    const c2 = -(h2 - h1 * n1dotn2) / (1 - n1dotn2 * n1dotn2);

    intersectionData.origin = this.normal.clone().multiplyScalar(c1).add(targetPlane.normal.clone().multiplyScalar(c2));

    return intersectionData;
  }

  coplanarPoint (optionalTarget) {

    const result = optionalTarget || new Vector3();


    return result.copy(this.normal).multiplyScalar(-this.constant);

  }

  translate (offset) {

    this.constant = this.constant - offset.dot(this.normal);

    return this;

  }

  equals (plane) {

    return plane.normal.equals(this.normal) && (plane.constant === this.constant);

  }

  clone () {

    return new Plane().copy(this);

  }
}

Plane.prototype.setFromCoplanarPoints = (function () {

  const v1 = new Vector3();
  const v2 = new Vector3();

  return function (a, b, c) {

    const normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();

    // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

    this.setFromNormalAndCoplanarPoint(normal, a);

    return this;

  };

})();

Plane.prototype.intersectLine = (function () {

  const v1 = new Vector3();

  return function (line, optionalTarget) {

    const result = optionalTarget || new Vector3();

    const direction = line.delta(v1);

    const denominator = this.normal.dot(direction);

    if (denominator === 0) {

      // Line is coplanar, return origin
      if (this.distanceToPoint(line.start) === 0) {

        return result.copy(line.start);

      }

      // Unsure if this is the correct method to handle this case.
      return undefined;

    }

    const t = -(line.start.dot(this.normal) + this.constant) / denominator;

    if (t < 0 || t > 1) {

      return undefined;

    }

    return result.copy(direction).multiplyScalar(t).add(line.start);

  };

})();

export default Plane;
