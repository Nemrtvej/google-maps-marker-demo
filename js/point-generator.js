var SimplePoint = function(latitude, longitude) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
};

SimplePoint.prototype.getLatitude = function() {
    return this.latitude;
};

SimplePoint.prototype.getLongitude = function() {
    return this.longitude;
};

SimplePoint.prototype.toString = function() {
    return this.getLatitude() + ',' + this.getLongitude();
};

SimplePoint.prototype.toGmap = function() {
    return {
        lat: this.getLatitude(),
        lng: this.getLongitude()
    };
};

function randomNumber(min, max) {
    if (min > max) {
        var helper = max;
        max = min;
        min = helper;
    }

    return (Math.random() * (max - min) + min).toFixed(8);
}

function generatePoint(minLatitude, maxLatitude, minLongitude, maxLongitude) {
    var latitude = randomNumber(minLatitude, maxLatitude);
    var longitude = randomNumber(minLongitude, maxLongitude);

    return new SimplePoint(latitude, longitude);
}

function fillDivWithRandomPoints(divId, pointsCount) {
    var points = document.querySelector('#'+divId);

    for (var i = 0; i < pointsCount; i++) {
        var point = generatePoint(-90, 90, -180, 180);

        points.innerHTML += point.toString() + "<br>";
    }
}