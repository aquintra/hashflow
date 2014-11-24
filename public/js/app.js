'use strict';

angular.module('App', [
'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/partials/main.html',
    controller: 'mainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);

})
.controller('appCtrl', function ($scope) {

});
