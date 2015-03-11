

angular.module('app.controllers.footer', []).controller('FooterController', function ($scope, $log) {
  
  'use strict';

  $log.debug('FooterController()');

  $scope.copyrightYear = (new Date()).getFullYear();

});
