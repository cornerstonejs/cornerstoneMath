import Vector3 from "./vector3";
import { clamp } from "./math";
import Matrix4 from "./matrix4";
import { INumber3 } from "./Interfaces";

// Copied from THREE.JS
/**
 * @author bhouston / http://exocortex.com
 */

class Line3 {
  start: Vector3;
  end: Vector3;

  constructor();
  constructor(start: Vector3, end: Vector3);
  constructor(start?: Vector3, end?: Vector3) {
    this.start = start || new Vector3();
    this.end = end || new Vector3();
  }

  set(start: Vector3, end: Vector3) {
    this.start.copy(start);
    this.end.copy(end);

    return this;
  }

  copy(line: Line3) {
    this.start.copy(line.start);
    this.end.copy(line.end);

    return this;
  }

  center(optionalTarget: Vector3 = new Vector3()) {
    return optionalTarget.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  delta(optionalTarget: Vector3) {
    return optionalTarget.subVectors(this.end, this.start);
  }

  distanceSq() {
    return this.start.distanceToSquared(this.end);
  }

  distance() {
    return this.start.distanceTo(this.end);
  }

  at(t: number, optionalTarget: Vector3 = new Vector3()) {
    const result = optionalTarget;

    return this.delta(result)
      .multiplyScalar(t)
      .add(this.start);
  }

  closestPointToPointParameter(point: INumber3, clampToLine: boolean = false) {
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

  closestPointToPoint(
    point: INumber3,
    clampToLine: boolean = false,
    optionalTarget: Vector3 = new Vector3()
  ) {
    const t = this.closestPointToPointParameter(point, clampToLine);
    return this.delta(optionalTarget)
      .multiplyScalar(t)
      .add(this.start);
  }

  applyMatrix4(matrix: Matrix4) {
    this.start.applyMatrix4(matrix);
    this.end.applyMatrix4(matrix);

    return this;
  }

  equals(line: Line3) {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }

  clone() {
    return new Line3().copy(this);
  }

  intersectLine(line: Line3) {
    // http://stackoverflow.com/questions/2316490/the-algorithm-to-find-the-point-of-intersection-of-two-3d-line-segment/10288710#10288710
    const da = this.end.clone().sub(this.start);
    const db = line.end.clone().sub(line.start);
    const dc = line.start.clone().sub(this.start);

    const daCrossDb = da.clone().cross(db);
    const dcCrossDb = dc.clone().cross(db);

    // Lines are not coplanar, stop here
    if (dc.dot(da) === 0) {
      return;
    }

    const s = dcCrossDb.dot(daCrossDb) / daCrossDb.lengthSq();

    // Make sure we have an intersection
    if (s > 1.0 || isNaN(s)) {
      return;
    }

    const intersection = this.start.clone().add(da.clone().multiplyScalar(s));
    const distanceTest =
      intersection
        .clone()
        .sub(line.start)
        .lengthSq() +
      intersection
        .clone()
        .sub(line.end)
        .lengthSq();

    if (distanceTest <= line.distanceSq()) {
      return intersection;
    }

    return;
  }
}

export default Line3;
