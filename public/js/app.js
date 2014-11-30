'use strict';

angular.module('App', [
'ngRoute',
'uiGmapgoogle-maps'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/partials/main.html',
    controller: 'mainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

})
.controller('appCtrl', function ($scope) {

});
