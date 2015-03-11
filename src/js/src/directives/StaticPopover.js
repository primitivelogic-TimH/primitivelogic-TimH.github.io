
angular.module('app.directives.static_popover', []).directive('staticPopover', ['$log', function ($log) {

  'use strict';

  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@' },
    templateUrl: 'templates/static-popover.html',
    link: function (scope, element, attrs) {
      scope.title = attrs.staticPopover;
      scope.$on('$destroy', function(){
        /* ------- */
      });
    }
  };

}]);