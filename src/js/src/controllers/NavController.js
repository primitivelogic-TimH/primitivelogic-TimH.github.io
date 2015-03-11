
angular.module('app.controllers.nav', []).controller('NavController', ['$rootScope','$scope','$timeout','$log','MobileMenu', function ($rootScope, $scope, $timeout, $log, MobileMenu) {
  
  'use strict';

  $log.debug('NavController()');

  $scope.alertVisible = false;

  // push down menu for alerts
  $rootScope.$on('push_down_menu', function (evt, val) {
    $log.debug('> receiving broadcast push_down_menu:', val);
    $scope.alertVisible = val.open;
  });

  // initialize menu
  MobileMenu.init();

  // toggle mobile slide menu
  $timeout(function () {
    $scope.toggleNav = function () {
      MobileMenu.toggle();
    };
  }, 0);

}]);
