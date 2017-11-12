/**
 *
 *   A --- B
 *   |     |
 *   |     |
 *   |     |
 *   C --- D
 *
 *   A = minX, minY
 *   B = maxX, minY
 *   C = minX, maxY
 *   D = maxX, maxY
 */
var GridSquare = function(pointA, pointD) {
    this.pointA = pointA;
    this.pointD = pointD;

    this.pointsInSquare = 0;
};

GridSquare.prototype.getGooglePath = function() {
    var pointB = new SimplePoint(this.pointA.getLatitude(), this.pointD.getLongitude());
    var pointC = new SimplePoint(this.pointD.getLatitude(), this.pointA.getLongitude());

    var corners = [];

    corners.push(this.pointA.toGmap());
    corners.push(pointC.toGmap());
    corners.push(this.pointD.toGmap());
    corners.push(pointB.toGmap());
    corners.push(this.pointA.toGmap());

    return corners;
};

GridSquare.prototype.addPoint = function() {
    this.pointsInSquare++;
};

GridSquare.prototype.getPointsInSquare = function() {
    return this.pointsInSquare;
};

GridSquare.prototype.containsPoint = function(point) {
    var betweenLatitudes = (point.getLatitude() >= this.pointA.getLatitude()) && (point.getLatitude() < this.pointD.getLatitude());
    var betweenLongitudes = (point.getLongitude() >= this.pointA.getLongitude()) && (point.getLongitude() < this.pointD.getLongitude());

    return betweenLatitudes && betweenLongitudes;
};

GridSquare.prototype.getCenterPoint = function() {
    var medianLatitude = (this.pointA.getLatitude() + this.pointD.getLatitude()) / 2;
    var medianLongitude = (this.pointA.getLongitude() + this.pointD.getLongitude()) / 2;

    return new SimplePoint(medianLatitude, medianLongitude);
};


var GridNetworkFactory = function() {
    // hopefully latitude is X, longitude is Y

    this.minX = -180;
    this.maxX = 180;

    this.minY = -90;
    this.maxY = 90;
};

GridNetworkFactory.prototype.generateGrid = function(stepSize) {
    var grid = [];


    for (var x = this.minX; x < this.maxX; x += stepSize ) {
        for (var y = this.minY; y < this.maxY; y += stepSize) {
            var pointA = new SimplePoint(y, x);
            var pointD = new SimplePoint(y + stepSize, x + stepSize);

            grid.push(new GridSquare(pointA, pointD));
        }
    }

    return grid;
};