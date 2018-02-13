import { assert, expect } from 'chai';
import Vector3 from '../src/vector3';
import Matrix4 from '../src/matrix4.js';

describe('Vector3', function () {
  it('constructor, copy, clone', function () {
    // Testing the constructor
    const vector1 = new Vector3(1, 2, 3);
    const vector2 = new Vector3();

    assert.deepEqual([vector1.x, vector1.y, vector1.z], [1, 2, 3], 'Constructor works.');
    assert.deepEqual([vector2.x, vector2.y, vector2.z], [0, 0, 0], 'Constructor works.');
    // Testing copy
    vector1.copy(vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [0, 0, 0], 'Copy works.');
    // Testing clone
    const vector3 = vector2.clone();

    assert.deepEqual([vector3.x, vector3.y, vector3.z], [0, 0, 0], 'Constructor works.');
  });
  it('set, setX, setY, setZ, setComponent, getComponent', function () {
    // Initialzing
    const vector = new Vector3();

    // Testing set
    vector.set(3, 2, 1);
    assert.deepEqual([vector.x, vector.y, vector.z], [3, 2, 1], 'Set works.');
    // Testing setX
    vector.setX(0);
    assert.deepEqual([vector.x, vector.y, vector.z], [0, 2, 1], 'setX works.');
    // Testing setY
    vector.setY(0);
    assert.deepEqual([vector.x, vector.y, vector.z], [0, 0, 1], 'setY works.');
    // Testing setZ
    vector.setZ(0);
    assert.deepEqual([vector.x, vector.y, vector.z], [0, 0, 0], 'setZ works.');
    // Testing setComponent
    vector.setComponent(0, 2);
    vector.setComponent(1, 3);
    vector.setComponent(2, 4);
    const badFun1 = function () {
      vector.setComponent(3, 1);
    };

    expect(badFun1).to.throw(Error);
    assert.deepEqual([vector.x, vector.y, vector.z], [2, 3, 4], 'setComponent works.');
    // Testing getComponent
    const badFun2 = function () {
      vector.getComponent(5);
    };

    expect(badFun2).to.throw(Error);
    assert.deepEqual([vector.getComponent(0), vector.getComponent(2)], [2, 4], 'getComponent works.');
  });
  it('add, addScalar, addVectors', function () {
    // Testing add
    const vector1 = new Vector3();
    const vector2 = new Vector3(1, 2, 3);

    vector1.addVectors(vector2, vector1);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [1, 2, 3], 'add works.');
    // Testing addScalar
    vector1.addScalar(3);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [4, 5, 6], 'addScalar works.');
    // Testing addVectors
    vector1.addVectors(vector1, vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [5, 7, 9], 'addVectors works.');
  });
  it('sub, subVectors', function () {
    // Testing sub
    const vector1 = new Vector3(-1, -1, -1);
    const vector2 = new Vector3(-2, -3, -4);

    vector1.sub(vector2, vector1);
    vector2.sub(vector1);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [-1, -2, -3], 'sub works.');
    assert.deepEqual([vector2.x, vector2.y, vector2.z], [-1, -1, -1], 'sub works.');
    // Testing subVectors
    vector1.subVectors(vector1, vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [0, -1, -2], 'subVectors works.');
  });
  it('multiply, multiplyScalar, multiplyVectors', function () {
    // Testing multiply
    const vector1 = new Vector3(1, 1, 1);
    const vector2 = new Vector3(2, 3, 4);

    vector1.multiply(vector2, vector1);
    vector2.multiply(vector1);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [2, 3, 4], 'multiply works.');
    assert.deepEqual([vector2.x, vector2.y, vector2.z], [4, 9, 16], 'multiply works.');
    // Testing multiplyScalar
    vector1.multiplyScalar(2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [4, 6, 8], 'multiply works.');
    // Testing multiplyVectors
    vector1.multiplyVectors(vector1, vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [16, 54, 128], 'multiply works.');
  });
  it('applyMatrix3, applyMatrix4, applyProjection', function () {
    // Testing applyMatrix3
    // Using Matrix4 to simulate matrix3
    const matrix3 = new Matrix4();
    const vector = new Vector3(1, 1, 1);

    matrix3.elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    vector.applyMatrix3(matrix3);
    assert.deepEqual([vector.x, vector.y, vector.z], [12, 15, 18], 'applyMatrix3 works.');
    // Testing applyMatrix4
    const matrix4 = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    vector.x = 1; vector.y = 1; vector.z = 1;
    vector.applyMatrix4(matrix4); // Gives translated (multiplied) vector.
    assert.deepEqual([vector.x, vector.y, vector.z], [10, 26, 42], 'applyMatrix4 works.');

    // Testing applyProjection
    vector.x = 1; vector.y = 1; vector.z = 1;
    vector.applyProjection(matrix4); // Applies perspective divide to normalize vector.
    assert.deepEqual([vector.x, vector.y, vector.z], [10 / 58, 26 / 58, 42 / 58], 'applyProjection works.');
  });
  it('applyAxisAngle, applyQuaternion, transformDirection', function () {
    // Testing applyAxisAngle and applyQuaternion
    const axis = new Vector3(1, 1, 1); // Vector to be used an axis for the quaternion
    const angle = Math.PI / 2;
    const vector = new Vector3(1, 1, 1);

    vector.applyAxisAngle(axis, angle); // Checks applyQuaternion by calling it internally
    assert.deepEqual([vector.x, vector.y, vector.z], [1, 1, 1], 'Vector rotated about itself.');
    vector.x = 1; vector.y = 1; vector.z = 1;
    axis.x = 0; axis.y = 1; axis.z = 0;
    const angle2 = Math.PI / 4;

    vector.applyAxisAngle(axis, angle2);
    // Application of quaternion returns a miniscule residual value in z
    assert.deepEqual([Math.round(vector.x * 1000) / 1000, vector.y, Math.round(vector.z)],
     [1.414, 1, -0], 'Vector rotated correctly.');
    vector.x = 2; vector.y = 2; vector.z = 3;
    axis.x = 1; axis.y = 1; axis.z = 0;
    const angle3 = 2 * Math.PI - Math.PI / 4;

    vector.applyAxisAngle(axis, angle3);
    assert.deepEqual([Math.round(vector.x * 1000) / 1000, Math.round(vector.y * 1000) / 1000,
      Math.round(vector.z * 1000) / 1000], [0.5, 3.5, 2.121], 'Vector rotated correctly.');
    // Testing transformDirection
    const transformMatrix = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    vector.x = 1; vector.y = 1; vector.z = 1;
    vector.transformDirection(transformMatrix); // Return z coordinate rounded down in the 16 decimal place
    assert.deepEqual([vector.x, vector.y, vector.z], [1 / Math.sqrt(35),
      3 / Math.sqrt(35), 0.8451542547285165], 'Transform Direction works.');
  });
  it('divide, divideScalar', function () {
    // Testing divide
    const vector1 = new Vector3(1, -1, 1);
    const vector2 = new Vector3(0, 2, Math.sqrt(2));

    vector1.divide(vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [Infinity, -0.5, 1 / Math.sqrt(2)], 'division works.');
    // Testing divideScalar
    vector1.divideScalar(2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [Infinity, -0.25, 1 / (2 * Math.sqrt(2))], 'divideScalar works.');
    vector1.divideScalar(0);
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [0, 0, 0], 'divideScalar works.');
  });
  it('min, max, clamp, clampScalar', function () {
    // Testing min
    const vector1 = new Vector3(-Infinity, -25, 121);
    const vector2 = new Vector3(20, 100, 1);

    vector1.min(vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [-Infinity, -25, 1], 'Min works.');
    // Testing max
    const vector3 = new Vector3(Infinity, -100, 1);

    vector1.max(vector3);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [Infinity, -25, 1], 'Max works.');
    // Testing clamp
    const min = new Vector3(-Infinity, 100, -2);
    const max = new Vector3(100, 200, Infinity);

    vector1.clamp(min, max);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [100, 100, 1], 'clamp works.');
    // Testing clampScalar
    vector1.clampScalar(50, 90);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [90, 90, 50], 'clampScalar works.');
  });
  it('floor, ceil, round, roundToZero', function () {
    // Testing floor
    const vector = new Vector3(25.32, Math.sqrt(2), -0);

    vector.floor();
    assert.deepEqual([vector.x, vector.y, vector.z], [25, 1, 0], 'floor works.');
    // Testing ceil
    vector.x = 25.32; vector.y = Math.sqrt(2); vector.z = -2;
    vector.ceil();
    assert.deepEqual([vector.x, vector.y, vector.z], [26, 2, -2], 'ceil works.');
    // Testing round
    vector.x = 25.62; vector.y = Math.sqrt(2); vector.z = -200;
    vector.round();
    assert.deepEqual([vector.x, vector.y, vector.z], [26, 1, -200], 'round works.');
    // Testing roundToZero
    vector.x = Infinity; vector.y = Math.sqrt(2); vector.z = -200.2;
    vector.roundToZero();
    assert.deepEqual([vector.x, vector.y, vector.z], [Infinity, 1, -200], 'roundToZero works.');
  });
  it('negate, dot, length, lengthSq, lengthManhattan', function () {
    // Testing negate
    const vector = new Vector3(2, 7, 16);

    vector.negate();
    assert.deepEqual([vector.x, vector.y, vector.z], [-2, -7, -16], 'negate works.');
    // Testing dot
    const newVector = new Vector3(-1, -2, -15);

    assert.equal(vector.dot(newVector), 256, 'dot product works.');
    // Testing length
    assert.equal(vector.length(), Math.sqrt(309), 'length works.');
    // Testing lengthSq
    assert.equal(vector.lengthSq(), 309, 'lengthSq works.');
    // Testing lengthManhattan
    assert.equal(newVector.lengthManhattan(), 18, 'lengthManhattan works.');
  });
  it('normalize, setLength, lerp', function () {
    // Testing normalize
    const vector = new Vector3(1, 2, 2);

    vector.normalize();
    assert.deepEqual([vector.x, vector.y, vector.z], [1 / 3, 2 / 3, 2 / 3], 'normalize works.');
    // Testing setLength
    vector.setLength(3);
    assert.deepEqual([vector.x, vector.y, vector.z], [1, 2, 2], 'setLength works.');
    // Testing lerp
    const newVector = new Vector3(1, 2, 3);

    vector.lerp(newVector, 0.5);
    assert.deepEqual([vector.x, vector.y, vector.z], [1, 2, 2.5], 'setLength works.');
  });
  it('cross, crossVectors', function () {
    // Testing crossVectors
    const vector1 = new Vector3(1, 2, 3);
    const vector2 = new Vector3(4, 5, 6);

    vector1.crossVectors(vector1, vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [-3, 6, -3], 'crossVectors works.');
    // Testing cross
    vector1.x = 0; vector1.y = 1; vector1.z = 2;
    vector1.cross(vector2);
    assert.deepEqual([vector1.x, vector1.y, vector1.z], [-4, 8, -4], 'cross works.');
  });
  it('projectOnVector, projectOnPlane, reflect', function () {
    // Testing projectOnVector
    const vector1 = new Vector3(1, 2, 6);
    const vector2 = new Vector3(-2, 3, 5);

    vector1.projectOnVector(vector2); // Returned values are off at the last decimal digit
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [-1.7894736842105268, 2.68421052631579, 4.473684210526317], 'projectOnVector works.');
    // Testing projectOnPlane
    const planeNormal = new Vector3(1, 0, 0);

    vector1.x = 1; vector1.y = 2; vector1.z = 3;
    vector1.projectOnPlane(planeNormal);
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [0, 2, 3], 'projectOnPlane works.');
    // Testing reflect
    const normal = new Vector3(0, 1, 0);

    vector1.x = 1; vector1.y = 2; vector1.z = 3;
    vector1.reflect(normal);
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [1, -2, 3], 'reflect works.');
  });
  it('angleTo, distanceTo, distanceToSquared', function () {
    // Testing angleTo
    const vector1 = new Vector3(1, 0, 0);
    const vector2 = new Vector3(0, 1, 0);

    assert.equal(vector1.angleTo(vector2), Math.PI / 2, 'angleTo works.');
    // Testing distanceToSquared
    assert.equal(vector1.distanceToSquared(vector2), 2, 'distanceToSquared works.');
    // Testing distanceTo
    assert.equal(vector1.distanceTo(vector2), Math.sqrt(2), 'distanceTo works.');
  });
  it('setFromMatrixPosition, setFromMatrixScale, setFromMatrixColumn', function () {
    // Testing setFromMatrixPosition
    const vector = new Vector3(1, 1, 1);
    const matrix = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    vector.setFromMatrixPosition(matrix);
    assert.deepEqual([vector.x, vector.y, vector.z],
     [4, 8, 12], 'setFromMatrixPosition works.');
    // Testing setFromMatrixScale
    vector.setFromMatrixScale(matrix);
    assert.deepEqual([vector.x, vector.y, vector.z],
     [Math.sqrt(107), Math.sqrt(140), Math.sqrt(179)], 'setFromMatrixScale works.');
    // Testing setFromMatrixColumn
    vector.setFromMatrixColumn(100, matrix);
    assert.deepEqual([vector.x, vector.y, vector.z],
     [undefined, undefined, undefined], 'setFromMatrixScale fails as expected.');
    vector.setFromMatrixColumn(3, matrix);
    assert.deepEqual([vector.x, vector.y, vector.z],
     [4, 8, 12], 'setFromMatrixScale works.');
  });
  it('equals, fromArray, toArray, clone', function () {
    // Testing equals
    const vector1 = new Vector3(1, 0, 0);
    const vector2 = new Vector3(0, 1, 0);

    assert.isFalse(vector1.equals(vector2), 'vectors not equal');
    vector2.x = 1; vector2.y = 0;
    assert.isOk(vector1.equals(vector2), 'vectors are equal.');
    // Testing fromArray
    vector1.fromArray([Infinity, -20.4343, 25]);
    assert.deepEqual([vector1.x, vector1.y, vector1.z],
     [Infinity, -20.4343, 25], 'fromArray works.');
    // Testing toArray
    assert.deepEqual(vector2.toArray(),
     [1, 0, 0], 'toArray works.');
    // Testing clone
    const clonedVector = vector1.clone();

    assert.deepEqual([clonedVector.x, clonedVector.y, clonedVector.z],
     [Infinity, -20.4343, 25], 'clone works.');
  });
});
