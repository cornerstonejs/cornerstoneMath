// Copied from Three.JS
/**
 * @author bhouston / http://exocortex.com
 */

var cornerstoneMath = (function (cornerstoneMath) {

    "use strict";

    if (cornerstoneMath === undefined) {
        cornerstoneMath = {};
    }

    cornerstoneMath.Plane = function ( normal, constant ) {

        this.normal = ( normal !== undefined ) ? normal : new cornerstoneMath.Vector3( 1, 0, 0 );
        this.constant = ( constant !== undefined ) ? constant : 0;

    };

    cornerstoneMath.Plane.prototype = {

        constructor: cornerstoneMath.Plane,

        set: function ( normal, constant ) {

            this.normal.copy( normal );
            this.constant = constant;

            return this;

        },

        setComponents: function ( x, y, z, w ) {

            this.normal.set( x, y, z );
            this.constant = w;

            return this;

        },

        setFromNormalAndCoplanarPoint: function ( normal, point ) {

            this.normal.copy( normal );
            this.constant = - point.dot( this.normal ); // must be this.normal, not normal, as this.normal is normalized

            return this;

        },

        setFromCoplanarPoints: function () {

            var v1 = new cornerstoneMath.Vector3();
            var v2 = new cornerstoneMath.Vector3();

            return function ( a, b, c ) {

                var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

                // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

                this.setFromNormalAndCoplanarPoint( normal, a );

                return this;

            };

        }(),


        copy: function ( plane ) {

            this.normal.copy( plane.normal );
            this.constant = plane.constant;

            return this;

        },

        normalize: function () {

            // Note: will lead to a divide by zero if the plane is invalid.

            var inverseNormalLength = 1.0 / this.normal.length();
            this.normal.multiplyScalar( inverseNormalLength );
            this.constant *= inverseNormalLength;

            return this;

        },

        negate: function () {

            this.constant *= - 1;
            this.normal.negate();

            return this;

        },

        distanceToPoint: function ( point ) {

            return this.normal.dot( point ) + this.constant;

        },

        distanceToSphere: function ( sphere ) {

            return this.distanceToPoint( sphere.center ) - sphere.radius;

        },

        projectPoint: function ( point, optionalTarget ) {

            return this.orthoPoint( point, optionalTarget ).sub( point ).negate();

        },

        orthoPoint: function ( point, optionalTarget ) {

            var perpendicularMagnitude = this.distanceToPoint( point );

            var result = optionalTarget || new cornerstoneMath.Vector3();
            return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

        },

        isIntersectionLine: function ( line ) {

            // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

            var startSign = this.distanceToPoint( line.start );
            var endSign = this.distanceToPoint( line.end );

            return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

        },

        intersectLine: function () {

            var v1 = new cornerstoneMath.Vector3();

            return function ( line, optionalTarget ) {

                var result = optionalTarget || new cornerstoneMath.Vector3();

                var direction = line.delta( v1 );

                var denominator = this.normal.dot( direction );

                if ( denominator === 0 ) {

                    // line is coplanar, return origin
                    if ( this.distanceToPoint( line.start ) === 0 ) {

                        return result.copy( line.start );

                    }

                    // Unsure if this is the correct method to handle this case.
                    return undefined;

                }

                var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

                if ( t < 0 || t > 1 ) {

                    return undefined;

                }

                return result.copy( direction ).multiplyScalar( t ).add( line.start );

            };

        }(),

        intersectPlane: function (targetPlane) {
            // Returns the intersection line between two planes
            var direction = this.normal.clone().cross(targetPlane.normal);
            var origin = new cornerstoneMath.Vector3();
            var intersectionData = {
                origin: origin,
                direction: direction
            };

            // If the planes are parallel, return an empty vector for the
            // intersection line
            if (this.normal.clone().cross(targetPlane.normal).length < 1e-10) {
                intersectionData.direction = new cornerstoneMath.Vector3();
                return intersectionData;
            }

            var h1 = this.constant;
            var h2 = targetPlane.constant;
            var n1dotn2 = this.normal.clone().dot(targetPlane.normal);

            var c1 = -(h1 - h2 * n1dotn2) / (1 - n1dotn2 * n1dotn2);
            var c2 = -(h2 - h1 * n1dotn2) / (1 - n1dotn2 * n1dotn2);
            intersectionData.origin = this.normal.clone().multiplyScalar(c1).add(targetPlane.normal.clone().multiplyScalar(c2));
            return intersectionData;
        },

        coplanarPoint: function ( optionalTarget ) {

            var result = optionalTarget || new cornerstoneMath.Vector3();
            return result.copy( this.normal ).multiplyScalar( - this.constant );

        },

        translate: function ( offset ) {

            this.constant = this.constant - offset.dot( this.normal );

            return this;

        },

        equals: function ( plane ) {

            return plane.normal.equals( this.normal ) && ( plane.constant == this.constant );

        },

        clone: function () {

            return new cornerstoneMath.Plane().copy( this );

        }
    };

    return cornerstoneMath;
}(cornerstoneMath));