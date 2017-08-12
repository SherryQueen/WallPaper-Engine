window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        }
})()

function random(min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min))
}

function easeOut(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}

function cos(angle) {
    return Math.cos(deg_to_rad(angle));
}

function sin(angle) {
    return Math.sin(deg_to_rad(angle));
}

function deg_to_rad(angle) {
    return angle * (Math.PI / 180.0);
}
