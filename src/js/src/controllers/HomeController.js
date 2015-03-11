
angular.module('app.controllers.home', []).controller('HomeController', ['$rootScope','$scope','$log','$templateCache', function ($rootScope, $scope, $log, $templateCache) {
  
  'use strict';

  $log.debug('HomeController()');

  // bottom page footer, community focused carousel
  $scope.community_slides = [
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' }
  ];

}]);
