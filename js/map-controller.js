var MapController = function(mapDivId, gridFactory) {
    this.gridFactory = gridFactory;

    this.mapDivId = mapDivId;
    this.map = null;

    this.markers = [];
    this.groupedMarkers = [];
    this.squarePaths = [];

    this.groupedPoints = [];
    this.simplePoints = [];
    this.gridSquares = [];
};

MapController.prototype.initMap = function() {
    var center = { lat: 48.9, lng: 14.5};

    var settings = {
        zoom: 4,
        center: center
    };

    var element = document.getElementById(this.mapDivId);

    this.map = new google.maps.Map(element, settings);
};

MapController.prototype.populateWithPoints = function(url) {
    console.log('Population starts');
    return fetch(url)
        .then(
            function(response){
                return response.text();
            }
        ).then(
            function(data) {
                var lines = data.split("\n");

                for (var i = 0; i < lines.length; i++) {
                    var coords = lines[i].split(",");

                    var point = new SimplePoint(coords[0], coords[1]);
                    this.addPoint(point);
                }

                console.log('Population ends');
            }.bind(this)
        ).catch(function(e) {
            console.log(e);
        });
};

MapController.prototype.addPoint = function(point) {
    var marker = new google.maps.Marker({
        position: point.toGmap(),
        map: this.map
    });

    this.simplePoints.push(point);
    this.markers.push(marker);
};

MapController.prototype.showMarkers = function() {
    this.markers.map(function(marker) {
        marker.setVisible(true);
    });
};

MapController.prototype.hideMarkers = function() {
    this.markers.map(function(marker) {
        marker.setVisible(false);
    });
};

MapController.prototype.hideGroupedMarkers = function() {
    this.groupedMarkers.map(function(marker) {
        marker.setVisible(false);
    });
};

MapController.prototype.showGroupedMarkers = function() {
    this.groupedMarkers.map(function(marker) {
        marker.setVisible(true);
    });
};

MapController.prototype.showLines = function() {
    this.squarePaths.map(function(square) {
        square.setVisible(true);
    });
};

MapController.prototype.hideLines = function() {
    this.squarePaths.map(function(square) {
        square.setVisible(false);
    });
};

MapController.prototype.setSize = function(size) {
    this.squarePaths.map(function(square) {
        square.setMap(null);
    });
    this.squarePaths = [];
    this.gridSquares = [];

    var newGrid = this.gridFactory.generateGrid(size);

    newGrid.map(function(gridSquare) {
        var config = {
            path: gridSquare.getGooglePath(),
            geodesic: true,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 1.0,
            map: this.map
        };
        var path = new google.maps.Polyline(config);

        this.squarePaths.push(path);
        this.gridSquares.push(gridSquare);
    }.bind(this));

    this.recalculatGroupedPoints();
};

MapController.prototype.recalculatGroupedPoints = function() {
    this.groupedMarkers.map(function(marker) {
        marker.setMap(null);
    });

    this.groupedMarkers = [];

    this.simplePoints.map(function(simplePoint) {
        for (var j = 0; j < this.gridSquares.length; j++) {
            var currentSquare = this.gridSquares[j];

            if (currentSquare.containsPoint(simplePoint)) {
                currentSquare.addPoint();
                return;
            }
        }
    }.bind(this));

    this.gridSquares.map(function(gridSquare) {
        if (gridSquare.getPointsInSquare() > 0) {
            var config = {
                map: this.map,
                position: gridSquare.getCenterPoint().toGmap(),
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+gridSquare.getPointsInSquare()+'|0000FF|FFFFFF'
            };

            var marker = new google.maps.Marker(config);
            this.groupedMarkers.push(marker);
        }
    }.bind(this));
};