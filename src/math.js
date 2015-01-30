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

    cornerstoneMath.clamp = clamp;
    cornerstoneMath.degToRad = degToRad;
    cornerstoneMath.radToDeg = radToDeg;

    return cornerstoneMath;
}(cornerstoneMath));