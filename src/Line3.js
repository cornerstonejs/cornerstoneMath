// Copied from THREE.JS
/**
 * @author bhouston / http://exocortex.com
 */


var cornerstoneMath = (function (cornerstoneMath) {

    "use strict";

    if (cornerstoneMath === undefined) {
        cornerstoneMath = {};
    }

    cornerstoneMath.Line3 = function ( start, end ) {

        this.start = ( start !== undefined ) ? start : new cornerstoneMath.Vector3();
        this.end = ( end !== undefined ) ? end : new cornerstoneMath.Vector3();

    };

    cornerstoneMath.Line3.prototype = {

        constructor: cornerstoneMath.Line3,

        set: function ( start, end ) {

            this.start.copy( start );
            this.end.copy( end );

            return this;

        },

        copy: function ( line ) {

            this.start.copy( line.start );
            this.end.copy( line.end );

            return this;

        },

        center: function ( optionalTarget ) {

            var result = optionalTarget || new cornerstoneMath.Vector3();
            return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

        },

        delta: function ( optionalTarget ) {

            var result = optionalTarget || new cornerstoneMath.Vector3();
            return result.subVectors( this.end, this.start );

        },

        distanceSq: function () {

            return this.start.distanceToSquared( this.end );

        },

        distance: function () {

            return this.start.distanceTo( this.end );

        },

        at: function ( t, optionalTarget ) {

            var result = optionalTarget || new cornerstoneMath.Vector3();

            return this.delta( result ).multiplyScalar( t ).add( this.start );

        },

        closestPointToPointParameter: function () {

            var startP = new cornerstoneMath.Vector3();
            var startEnd = new cornerstoneMath.Vector3();

            return function ( point, clampToLine ) {

                startP.subVectors( point, this.start );
                startEnd.subVectors( this.end, this.start );

                var startEnd2 = startEnd.dot( startEnd );
                var startEnd_startP = startEnd.dot( startP );

                var t = startEnd_startP / startEnd2;

                if ( clampToLine ) {

                    t = cornerstoneMath.Math.clamp( t, 0, 1 );

                }

                return t;

            };

        }(),

        closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

            var t = this.closestPointToPointParameter( point, clampToLine );

            var result = optionalTarget || new cornerstoneMath.Vector3();

            return this.delta( result ).multiplyScalar( t ).add( this.start );

        },

        applyMatrix4: function ( matrix ) {

            this.start.applyMatrix4( matrix );
            this.end.applyMatrix4( matrix );

            return this;

        },

        equals: function ( line ) {

            return line.start.equals( this.start ) && line.end.equals( this.end );

        },

        clone: function () {

            return new cornerstoneMath.Line3().copy( this );

        },

        intersectLine: function ( line ) {
            // http://stackoverflow.com/questions/2316490/the-algorithm-to-find-the-point-of-intersection-of-two-3d-line-segment/10288710#10288710
            var da = this.end.clone().sub(this.start);
            var db = line.end.clone().sub(line.start);
            var dc = line.start.clone().sub(this.start);

            var daCrossDb = da.clone().cross(db);
            var dcCrossDb = dc.clone().cross(db);

            if (dc.dot(da) === 0){
                // Lines are not coplanar, stop here
                return;
            }

            var s = dcCrossDb.dot(daCrossDb) / daCrossDb.lengthSq();

            // Make sure we have an intersection
            if (s > 1.0 || isNaN(s)) {
                return;
            }

            var intersection = this.start.clone().add(da.clone().multiplyScalar(s));
            var distanceTest = intersection.clone().sub(line.start).lengthSq() + intersection.clone().sub(line.end).lengthSq();
            if (distanceTest <= line.distanceSq()) {
                return intersection;
            }
            return;
        }
    };

    return cornerstoneMath;
}(cornerstoneMath));