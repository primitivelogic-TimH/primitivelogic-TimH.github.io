
/**
 * @directive rightSideNav
 * @description pretty nav with 
 * @support edward.hotchkiss@primitivelogic.com
 *
 * @usage:
 *
 * @view:
 *
 * <right-side-nav data='items'></right-side-nav>
 * 
 * @controller:
 * 
 * $scope.items = [
 *   {
 *     title   : 'Leak Recognition',
 *     linksTo : 'safety-awareness'
 *   },
 *   { 
 *     title   : 'Call 811',
 *     linksTo : 'safety-call-811'
 *   }
 * ];
 */

angular.module('app.directives.right_side_nav', []).directive('rightSideNav', ['$log','$location','$window','$document','$timeout','$rootScope', function ($log, $location, $window, $document, $timeout, $rootScope) {

  'use strict';

  return {
    restrict: 'EA',
    replace: true,
    scope: { data: '=' },
    templateUrl: 'templates/right-side-nav.html',

    controller: function($scope) {
    },
    
    link: function ($scope, $elem, attrs) {
      
      var updateHashTimeout
        , body = angular.element(document.querySelectorAll('body'))
        , nav = angular.element(document.querySelectorAll('#right-side-nav'));

      // note initialization
      $scope.init = true;
      $scope.initComplete = false;

      // tmp hash hack
      $scope.tmpHash = null;

      // parse data
      $scope.items = $scope.data;

      // ready the dom
      $timeout(function () {
        if ($location.hash() === '') {
          $scope.current = null;
        } else {
          $scope.items.forEach(function (item, index) {
            if (item.linksTo === $location.hash()) {
              $scope.current = index;
              return;
            }
          });
          $log.debug('directives(): rightSideNav(): current:', $scope.current);
        }
        // set top dynamically
        nav.css('top', (($window.innerHeight / 2) - (nav[0].offsetHeight / 2)) + 'px');
        // already on a hash? scroll to it/set it! (check for null as 0 is an index or coerce)
        if ($scope.current !== null) {
          // wait for angular-scroll to reset
          $scope.scrollTo($scope.current);
        }
        // denote initializing
        $timeout(function () {
          $scope.init = false;
        }, 3000);
        $timeout(function () {
          $scope.initComplete = true;
          $scope.init = false;
        }, 3500);
      }, 0);

      // previous section
      $scope.prev = function () {
        if ($scope.current > 0) {
          $scope.current--;
          $scope.scrollTo($scope.current);
        }
      };

      // next section
      $scope.next = function () {
        if ($scope.current <= $scope.items.length) {
          $scope.current++;
          $scope.scrollTo($scope.current);
        }
      };

      // scroll to section by index in arr
      $scope.scrollTo = function (index) {
        var toElem, divId = $scope.items[index].linksTo;
        $log.debug('directives(): rightSideNav(): scrollTo: index:', index);
        // set our hash
        $location.hash(divId);
        toElem = angular.element(document.getElementById(divId));
        // scroll smoothly
        $document.scrollToElement(toElem, 100, 1000);
        // set current to our new index
        $scope.current = index;
        $scope.tmpHash = null;
      };

      // toggle active section piece class
      $scope.isActiveSection = function (linksTo) {
        return ((((linksTo === $location.hash()) && !$scope.tmpHash) || (linksTo === $scope.tmpHash)) && !$scope.init && $scope.initComplete) ?
          true : false;
      };

      // new item in viewport...
      $rootScope.$on('became_in_view', function (evt, id) {
        if ($scope.initComplete === true) {
          if ($location.hash() === 'id' || !id) {
            return;
          }
          clearTimeout(updateHashTimeout);
          updateHashTimeout = setTimeout(function () {
            $scope.tmpHash = id;
            clearTimeout(updateHashTimeout);
          }, 350);
        }
      });

      // we don't need this method atm
      $scope.$on('$destroy', function () {
        //...
      });

    }
  };

}]);
