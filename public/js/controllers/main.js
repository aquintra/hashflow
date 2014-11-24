(function() {

var socket = io.connect();

angular.module('App')
.controller('mainCtrl', function ($scope) {
  var self = $scope;
  self.images = [];
  console.log(self.images);

  self.init = function () {
    self.firstImages();
    self.realTime();
  }

  self.imageData = function (data) {
    return {
      id:     data.id,
      url:    data.link,
      src:    data.images.low_resolution.url,
      width:  data.images.low_resolution.width,
      height: data.images.low_resolution.height
    };
  };

  self.firstImages = function () {
    socket.on('firstShow', function (data) {
      angular.forEach(data.firstShow, function(data, key) {
        self.images.push(self.imageData(data));
      });
      self.$apply()
    });
  }

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
          var d = new Date();
          var s = d.getSeconds();

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
            console.log(self.images);
            setTimeout(function(){
              self.$apply(function() {
                self.images.unshift(self.imageData(data.data[0]));
                self.$apply;
              });
              load = true;
            }, 1000);
          }

        });
      }
    });
  }
});

})(this);
