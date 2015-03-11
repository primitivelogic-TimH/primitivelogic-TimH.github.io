
angular.module('app.directives.json_text', []).directive('jsonText', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {            
      function into(input) {
        return JSON.parse(input);
      }
      function out(data) {
        return data.$viewValue;
      }
      ngModel.$parsers.push(into);
      ngModel.$formatters.push(out);
    }
  };
});