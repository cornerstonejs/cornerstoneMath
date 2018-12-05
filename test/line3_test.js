import { assert } from 'chai';
import Line3 from '../src/Line3';
import Vector3 from '../src/vector3';

describe('Line3', function () {
  it('constructor, copy, clone', function () {

    // Testing the constructor
    const start = new Vector3(1, 1, 1);
    const end = new Vector3(2, 1, 1);
    const line1 = new Line3(start, end);
    const line2 = new Line3();

    assert.deepEqual(line1.start, start, 'Start is equal.');
    assert.deepEqual(line1.end, end, 'End is equal.');
    assert.deepEqual(line2.start, new Vector3(), 'Start is equal.');
    assert.deepEqual(line2.end, new Vector3(), 'End is equal.');

    // Testing copy
    line2.copy(line1);
    assert.deepEqual(line2.start, start, 'Copy works.');
    assert.deepEqual(line2.end, end, 'Copy works.');

    // Testing clone
    const line3 = line2.clone();

    assert.deepEqual(line3.start, start, 'Clone works.');
    assert.deepEqual(line3.end, end, 'Clone works.');
  });
  it('distance', function () {
    const start = new Vector3(1, 1, 1);
    const end = new Vector3(2, 1, 1);
    const line = new Line3(start, end);

    assert.equal(line.distance(), 1);
  });
  it('closestPointToPointParameter', function () {
    const start = new Vector3(0, 0, 0);
    const end = new Vector3(2, 0, 0);
    const line = new Line3(start, end);
    const point = { x: 1,
      y: 1,
      z: 0 };

    // Test non-clamped
    assert.equal(line.closestPointToPointParameter(point, false), 0.5);

    // Test clamped
    assert.equal(line.closestPointToPointParameter(point, true), 0.5);
  });
});
