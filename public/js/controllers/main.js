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
      zoom: 3,
      options: {
        styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}],
      }
    };

    self.reset = function () {
      self.images = [];
    }

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

    self.init = function () {
      self.realTime();
    };

  });

})(this);
