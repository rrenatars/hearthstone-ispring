var drag = false;
var posX = 300, posY = 300;
var px = 0, py = 0;
var el = document.querySelector('.am-card');

var loop = setInterval(function() {
    var tamX = el.offsetWidth / 2,
        tamY = el.offsetHeight / 2;

    var x2 = Math.ceil(el.offsetLeft + tamX),
        y2 = Math.ceil(el.offsetTop + tamY);

    var deltaY = posY - y2;
    var deltaX = posX - x2;

    var tiltx = -(deltaY / y2),
        tilty = (deltaX / x2);

    var raio = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
    var degree = raio * 40;
    if (Math.abs(degree) > 60) degree = 60;

    px += (posX - px - tamX) / 22;
    py += (posY - py - tamY) / 22;

    el.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';
    el.style.left = px + 'px';
    el.style.top = py + 'px';
}, 10);

document.addEventListener('mousemove', function(event) {
    if (drag) {
        posX = event.pageX;
        posY = event.pageY;
    }
});

document.addEventListener('mouseup', function() {
    drag = false;
});

el.addEventListener('mousedown', function() {
    drag = true;
});
