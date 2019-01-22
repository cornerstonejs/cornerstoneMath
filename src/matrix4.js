import Vector3 from './vector3.js';

// Based on THREE.JS
class Matrix4 {

  constructor (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    this.elements = new Float32Array(16);

    // TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
    // We should not support semi specification of Matrix4, it is just weird.

    const te = this.elements;

    te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
    te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
    te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
    te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;

  }

  makeRotationFromQuaternion (q) {
    const te = this.elements;

    let x = q.x,
      y = q.y,
      z = q.z,
      w = q.w;
    let x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    let xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    let yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    let wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    te[0] = 1 - (yy + zz);
    te[4] = xy - wz;
    te[8] = xz + wy;

    te[1] = xy + wz;
    te[5] = 1 - (xx + zz);
    te[9] = yz - wx;

    te[2] = xz - wy;
    te[6] = yz + wx;
    te[10] = 1 - (xx + yy);

    // Last column
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;

    // Bottom row
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return this;
  }

  multiplyMatrices (a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    let a11 = ae[0],
      a12 = ae[4],
      a13 = ae[8],
      a14 = ae[12];
    let a21 = ae[1],
      a22 = ae[5],
      a23 = ae[9],
      a24 = ae[13];
    let a31 = ae[2],
      a32 = ae[6],
      a33 = ae[10],
      a34 = ae[14];
    let a41 = ae[3],
      a42 = ae[7],
      a43 = ae[11],
      a44 = ae[15];

    let b11 = be[0],
      b12 = be[4],
      b13 = be[8],
      b14 = be[12];
    let b21 = be[1],
      b22 = be[5],
      b23 = be[9],
      b24 = be[13];
    let b31 = be[2],
      b32 = be[6],
      b33 = be[10],
      b34 = be[14];
    let b41 = be[3],
      b42 = be[7],
      b43 = be[11],
      b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  multiply (m, n) {

    if (n !== undefined) {

      console.warn('DEPRECATED: Matrix4\'s .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');

      return this.multiplyMatrices(m, n);
    }

    return this.multiplyMatrices(this, m);
  }

  getInverse (m, throwOnInvertible) {

    // Based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const te = this.elements;
    const me = m.elements;

    let n11 = me[0],
      n12 = me[4],
      n13 = me[8],
      n14 = me[12];
    let n21 = me[1],
      n22 = me[5],
      n23 = me[9],
      n24 = me[13];
    let n31 = me[2],
      n32 = me[6],
      n33 = me[10],
      n34 = me[14];
    let n41 = me[3],
      n42 = me[7],
      n43 = me[11],
      n44 = me[15];

    te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    const det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

    if (det === 0) {

      const msg = 'Matrix4.getInverse(): can\'t invert matrix, determinant is 0';

      if (throwOnInvertible || false) {

        throw new Error(msg);

      } else {

        console.warn(msg);

      }

      this.identity();

      return this;
    }

    this.multiplyScalar(1 / det);

    return this;

  }

  applyToVector3Array () {

    const v1 = new Vector3();

    return function (array, offset, length) {

      if (offset === undefined) {
        offset = 0;
      }
      if (length === undefined) {
        length = array.length;
      }

      for (var i = 0, j = offset; i < length; i += 3, j += 3) {

        v1.x = array[j];
        v1.y = array[j + 1];
        v1.z = array[j + 2];

        v1.applyMatrix4(this);

        array[j] = v1.x;
        array[j + 1] = v1.y;
        array[j + 2] = v1.z;

      }

      return array;

    };

  }

  makeTranslation (x, y, z) {

    this.set(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1
    );

    return this;

  }

  multiplyScalar (s) {

    const te = this.elements;

    te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
    te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
    te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
    te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

    return this;

  }

  set (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

    const te = this.elements;

    te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
    te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
    te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
    te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

    return this;

  }

  makeScale (x, y, z) {

    this.set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    );

    return this;

  }
}

export default Matrix4;
