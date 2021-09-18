function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
    return p5.prototype.collideRectRect(x, y, w, h, x2, y2, w2, h2);
}

function collideRectCircle(rx, ry, rw, rh, cx, cy, diameter){
    return p5.prototype.collideRectCircle(rx, ry, rw, rh, cx, cy, diameter);
}

function collideCircleCircle(x, y, d, x2, y2, d2) {
    return p5.prototype.collideCircleCircle(x, y, d, x2, y2, d2);
}

function collidePointCircle(x, y, cx, cy, d) {
    return p5.prototype.collidePointCircle(x, y, cx, cy, d);
}

function collidePointEllipse(x, y, cx, cy, dx, dy) {
    return p5.prototype.collidePointEllipse(x, y, cx, cy, dx, dy);
}

function collidePointRect(pointX, pointY, x, y, xW, yW){
    return p5.prototype.collidePointRect(pointX, pointY, x, y, xW, yW);
}

function collidePointLine(px, py, x1, y1, x2, y2, buffer) {
    return p5.prototype.collidePointLine(px, py, x1, y1, x2, y2, buffer);
}

function collideLineCircle(x1, y1, x2, y2, cx, cy, diameter) {
    return p5.prototype.collideLineCircle(x1, y1, x2, y2, cx, cy, diameter);
}

function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
    return p5.prototype.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection);
}

function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
    return p5.prototype.collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection);
}

function collidePointPoly(px, py, vertices) {
    return p5.prototype.collidePointPoly(px, py, vertices);
}

function collideCirclePoly(cx, cy, diameter, vertices, interior) {
    return p5.prototype.collideCirclePoly(cx, cy, diameter, vertices, interior);
}

function collideRectPoly(rx, ry, rw, rh, vertices, interior) {
    return p5.prototype.collideRectPoly(rx, ry, rw, rh, vertices, interior);
}

function collideLinePoly(x1, y1, x2, y2, vertices) {
    return p5.prototype.collideLinePoly(x1, y1, x2, y2, vertices);
}

function collidePolyPoly(p1, p2, interior) {
    return p5.prototype.collidePolyPoly(p1, p2, interior);
}

function collidePointTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    return p5.prototype.collidePointTriangle(px, py, x1, y1, x2, y2, x3, y3);
}

function collidePointArc(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
    return p5.prototype.collidePointArc(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer);
}