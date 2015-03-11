
angular.module('app.controllers.rebates_and_promotions', []).controller('RebatesAndPromotionsController', ['$rootScope','$scope','$log','$location','$window', function ($rootScope, $scope, $log, $location, $window) {
  
  'use strict';

  $log.debug('RebatesAndPromotionsController()');

  $scope.windowWidth = function () {
    return $window.innerWidth;
  };
 
  $scope.refineMenuOpen = false;
  $log.debug('RebatesAndPromotionsController(): $scope.refineMenuOpen', $scope.refineMenuOpen);

  $scope.refine = function (val) {
    $scope.refineMenuOpen = val;
    $log.debug('RebatesAndPromotionsController(): $scope.refineMenuOpen', $scope.refineMenuOpen);
  };

}]);
