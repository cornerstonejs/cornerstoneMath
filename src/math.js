// Based on THREE.JS

var cornerstoneMath = (function (cornerstoneMath) {

    "use strict";

    if (cornerstoneMath === undefined) {
        cornerstoneMath = {};
    }

    function clamp(x,a,b) {
        return ( x < a ) ? a : ( ( x > b ) ? b : x );
    }

    function degToRad(degrees) {
        var degreeToRadiansFactor = Math.PI / 180;
        return degrees * degreeToRadiansFactor;
    }

    function radToDeg(radians) {
        var radianToDegreesFactor = 180 / Math.PI;
        return radians * radianToDegreesFactor;
    }

    // Returns sign of number
    function sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    cornerstoneMath.clamp = clamp;
    cornerstoneMath.degToRad = degToRad;
    cornerstoneMath.radToDeg = radToDeg;
    cornerstoneMath.sign = sign;

    return cornerstoneMath;
}(cornerstoneMath));