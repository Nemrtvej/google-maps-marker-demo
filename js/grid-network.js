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

    this.pointsInSquare = [];
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

GridSquare.prototype.addPoint = function(point) {
    if (!this._containsPoint(point)) {
        return false;
    }

    this.pointsInSquare.push(point);

    return true;
};

GridSquare.prototype.getPointsInSquare = function() {
    return this.pointsInSquare.length;
};

GridSquare.prototype._containsPoint = function(point) {
    var betweenLatitudes = (point.getLatitude() >= this.pointA.getLatitude()) && (point.getLatitude() < this.pointD.getLatitude());
    var betweenLongitudes = (point.getLongitude() >= this.pointA.getLongitude()) && (point.getLongitude() < this.pointD.getLongitude());

    return betweenLatitudes && betweenLongitudes;
};

GridSquare.prototype.getCenterPoint = function() {
    var medianLatitude = (this.pointA.getLatitude() + this.pointD.getLatitude()) / 2;
    var medianLongitude = (this.pointA.getLongitude() + this.pointD.getLongitude()) / 2;

    var centerPoint = new SimplePoint(medianLatitude, medianLongitude);
    var randomPoint = generatePoint(this.pointA.getLatitude(), this.pointD.getLatitude(), this.pointA.getLongitude(), this.pointD.getLongitude());


    var pointsForCalculation = [];
    pointsForCalculation.push(centerPoint);
    pointsForCalculation.push(randomPoint);
    this.pointsInSquare.map(function(pointInSquare) {
        pointsForCalculation.push(pointInSquare);
    });

    return this._calculateCenterPoint(pointsForCalculation);
};

GridSquare.prototype._calculateCenterPoint = function(points) {
    var latitude = 0;
    var longitude = 0;

    points.map(function(point) {
        latitude += point.getLatitude();
        longitude += point.getLongitude();
    });

    return new SimplePoint(latitude / points.length, longitude / points.length);
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