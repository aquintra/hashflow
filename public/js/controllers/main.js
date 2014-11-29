(function() {

var socket = io.connect();

angular.module('App')
.controller('mainCtrl', function ($scope) {

  var self = $scope;
  self.images = [];

  self.map = {
    center: {
      latitude: 25,
      longitude: 10
    },
    zoom: 3
  };

  self.init = function () {
    self.realTime();
  };

  self.imageData = function (data) {
    return {
      id:        data.id,
      url:       data.link,
      src:       data.images.low_resolution.url,
      width:     data.images.low_resolution.width,
      height:    data.images.low_resolution.height,
      latitude:  data.location.latitude,
      longitude: data.location.longitude,
      options: {
        icon: {
          url: data.images.low_resolution.url,
          scaledSize: new google.maps.Size(60, 60)
        },
        animation: google.maps.Animation.DROP
      }
    };
  };

  self.realTime = function () {
    var load = true;
    socket.on('show', function(data) {
      if (load) {
        load = false;
        var url = data.show;
        function ajaxCall (getData) {
          $.ajax({
            url: url,
            type: 'POST',
            crossDomain: true,
            dataType: 'jsonp'
          }).done(function (data) {
            getData(data);
          });
        }

        ajaxCall(function(data) {

          if (self.images.length >= 29) {
            self.images.splice(29, 1);
          }

          var isEqual = false;
          for (var i = 0; i < self.images.length; i++) {
            if (self.images[i].id === data.data[0].id) {
              isEqual = true;
            }
          }

          if (!isEqual) {
            setTimeout(function() {
              self.$apply(function() {
                if (data.data[0].location) {
                  self.images.unshift(self.imageData(data.data[0]));
                  self.$apply;
                  console.log(self.images);
                }
              });
              load = true;
            }, 200);
          }

        });
      }
    });
  }

});

})(this);
