import Vector3 from './vector3.js';
import { clamp, approximatelyEquals } from './math.js';

// Copied from THREE.JS
/**
 * @author bhouston / http://exocortex.com
 */


class Line3 {
  constructor (start, end) {

    this.start = (start !== undefined) ? start : new Vector3();
    this.end = (end !== undefined) ? end : new Vector3();

  }

  set (start, end) {

    this.start.copy(start);
    this.end.copy(end);

    return this;

  }

  copy (line) {

    this.start.copy(line.start);
    this.end.copy(line.end);

    return this;

  }

  center (optionalTarget) {

    const result = optionalTarget || new Vector3();


    return result.addVectors(this.start, this.end).multiplyScalar(0.5);

  }

  delta (optionalTarget) {

    const result = optionalTarget || new Vector3();


    return result.subVectors(this.end, this.start);

  }

  distanceSq () {

    return this.start.distanceToSquared(this.end);

  }

  distance () {

    return this.start.distanceTo(this.end);

  }

  at (t, optionalTarget) {

    const result = optionalTarget || new Vector3();

    return this.delta(result).multiplyScalar(t).add(this.start);

  }

  closestPointToPointParameter (point, clampToLine) {

    const startP = new Vector3();
    const startEnd = new Vector3();

    startP.subVectors(point, this.start);
    startEnd.subVectors(this.end, this.start);

    const startEnd2 = startEnd.dot(startEnd);
    const startEnd_startP = startEnd.dot(startP);

    let t = startEnd_startP / startEnd2;

    if (clampToLine) {
      t = clamp(t, 0, 1);
    }

    return t;

  }

  closestPointToPoint (point, clampToLine, optionalTarget) {

    const t = this.closestPointToPointParameter(point, clampToLine);

    const result = optionalTarget || new Vector3();

    return this.delta(result).multiplyScalar(t).add(this.start);

  }

  applyMatrix4 (matrix) {

    this.start.applyMatrix4(matrix);
    this.end.applyMatrix4(matrix);

    return this;

  }

  equals (line) {

    return line.start.equals(this.start) && line.end.equals(this.end);

  }

  clone () {

    return new Line3().copy(this);

  }

  intersectLine (line) {
    // http://stackoverflow.com/questions/2316490/the-algorithm-to-find-the-point-of-intersection-of-two-3d-line-segment/10288710#10288710
    // Consider two lines r1 and r2, represented by the following parametric equations:A + vt and B + us, respectively.
    // Where A is a point of r1 and v a vector parallel to line.
    // And B is a point of r2 and u a vector parallel to line.
    // 'this' represents r2 and 'line' represents r1
    const da = this.end.clone().sub(this.start); //u
    const db = line.end.clone().sub(line.start); //v
    const dc = line.start.clone().sub(this.start); // AB

    const daCrossDb = da.clone().cross(db);
    const dcCrossDb = dc.clone().cross(db);

    // Lines are not coplanar, stop here
    // Coplanar only if the vectors AB, u, v are linearly dependent, i.e AB . (u × v) = 0
    const coplanarResult = dc.dot(daCrossDb);
    const normalizedCoplanarResult = coplanarResult / (dc.lengthSq() * daCrossDb.lengthSq());
    if (!approximatelyEquals(normalizedCoplanarResult, 0)) {
      return;
    }

    const s = dcCrossDb.dot(daCrossDb) / daCrossDb.lengthSq();

    // Make sure we have an intersection
    if (s > 1.0 || isNaN(s)) {
      return;
    }

    const intersection = this.start.clone().add(da.clone().multiplyScalar(s));
    const distanceTest = intersection.clone().sub(line.start).lengthSq() + intersection.clone().sub(line.end).lengthSq();

    if (distanceTest <= line.distanceSq()) {
      return intersection;
    }

    return;
  }
}

export default Line3;
