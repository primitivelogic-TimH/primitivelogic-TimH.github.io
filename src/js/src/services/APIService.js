
angular.module('app.services.api', []).factory('API', function($http) {

  'use strict';

  var BASE_API_URL = 'http://jbossews-namethesecond.rhcloud.com/SwgasWs-0.1/rest/form/echo/test';

  return {

    get: function(endpoint, data) {
      var URL = BASE_API_URL;
      return $http.jsonp(URL, data);
    }
  
  };

});
