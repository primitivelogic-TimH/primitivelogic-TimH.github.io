
angular.module('app.controllers.alerts', []).controller('AlertsController', ['$rootScope','$scope','$timeout','$log','AlertsService', function ($rootScope, $scope, $timeout, $log, AlertsService) {
  
  'use strict';

  $log.debug('AlertsController()');

  // fetch alerts
  $rootScope.$on('alerts_update', function(evt, alerts) {
    $log.debug('AlertsController(): alerts_update: alerts:', alerts);
    $scope.alerts = alerts;
  });

  // set default
  $scope.alertVisible = false;

  // add opening
  $timeout(function () {
    /*$scope.alertVisible = true;
    AlertsService.add({ 
      type : 'warning',
      msg  : 'A message to our customers regarding odorant levels in Southern Arizona. Read more'
    });*/
  }, 1000);

  $scope.closeAlert = function(index) {
    $scope.alertVisible = false;
    AlertsService.remove(index);
  };

}]);
