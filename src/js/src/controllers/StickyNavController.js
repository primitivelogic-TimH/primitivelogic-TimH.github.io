
angular.module('app.controllers.sticky_nav', []).controller('StickyNavController', ['$rootScope','$scope','$log','$timeout', function ($rootScope, $scope, $log, $timeout) {
  
  'use strict';

  $log.debug('StickyNavController()');

  $(document).ready(function() {
    var stickyNavTop = $('.sticky-menu').offset().top
      , stickyNav = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) { 
          $('.sticky-menu').addClass('sticky');
        } else {
          $('.sticky-menu').removeClass('sticky'); 
        }
      };
      stickyNav();
      $(window).scroll(function() {
        stickyNav();
      });
    });

  $timeout(function () {
    $scope.sticky_select = '_default_';
  }, 0);

}]);

