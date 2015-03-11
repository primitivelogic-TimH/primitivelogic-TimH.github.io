
// our base angular module
var origin, app, BASE_URL, DEVELOPMENT, TEMPLATE_URL;

app = angular.module('app', []);

origin = window.location.origin;
DEVELOPMENT = (origin === 'http://localhost:8000' || origin === 'http://edwardhotchkiss.github.io') ?
  true : false;

// initialize angular module "app"
angular.module('app', ['ngRoute','ngAnimate','cgBusy','ngResource','ngCookies','sticky','angular-inview','duScroll','angular-gestures','ui.bootstrap','app.templates','app.directives','app.controllers','app.services']).config(['$locationProvider','$routeProvider', function ($locationProvider, $routeProvider) {

  'use strict';

  if (DEVELOPMENT) {
    TEMPLATE_URL = 'templates/';
    BASE_URL = '#/';
    $locationProvider.html5Mode(false);
  } else {
    BASE_URL = '/';
    TEMPLATE_URL = 'templates/';
    $locationProvider.html5Mode(true);
  }

  // dynamically route excluding several custom template controllers
  $routeProvider.when('/safety', {
    templateUrl    : TEMPLATE_URL + 'safety.html',
    controller     : 'SafetyController',
    reloadOnSearch : false
  })
  .when('/rebates-and-promotions', {
    templateUrl    : TEMPLATE_URL + 'rebates-and-promotions.html',
    controller     : 'RebatesAndPromotionsController',
    reloadOnSearch : true
  })
  .when('/', {
    templateUrl    : TEMPLATE_URL + 'home.html',
    controller     : 'HomeController',
    reloadOnSearch : true
  })
  .when('/:page*', {
    templateUrl: function(params) {
      $log.debug(".when('/:page*':", params);
      return TEMPLATE_URL + params.page + '.html';
    },
    controller: 'MasterController'
  });
  
}])

.run(function ($location, $rootScope, $log, $window, $timeout, $http, SessionService) {

  'use strict';

  var origin;

  // create a new WOW.js instance
  new WOW().init();

  // route change event
  $rootScope.$on('$routeChangeStart', function (next, current) {
    // when the view changes sync wow
    new WOW().sync();
  });

  // method to actually perform calculations for nav
  function resetNav(val) {
    var reset, navs = angular.element(document.querySelectorAll('.dropdown-menu'));
    // broadcast size changes
    $rootScope.$broadcast('window_inner_width:change', val);
    // adjust menu
    if (val >= 1500) {
      angular.element(document.querySelectorAll('.dropdown-menu')).css('width', '1500px');
      angular.element(document.querySelectorAll('.dropdown-menu')).css('margin-left', '-509px');
    } else if (val <= 768) {
      angular.element(document.querySelectorAll('.dropdown-menu')).css('width', 'auto');
      angular.element(document.querySelectorAll('.dropdown-menu')).css('margin-left', '-' + reset + 'px');
    } else if (val < 1500) {
      reset = 509 - ((1500 - val) / 2) + 15;
      angular.element(document.querySelectorAll('.dropdown-menu')).css('width', val + 20 + 'px');
      angular.element(document.querySelectorAll('.dropdown-menu')).css('margin-left', '-' + reset + 'px');
    }
  }

  // reset nav on route change success
  $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
    $rootScope.$watch(function () {
        return $window.innerWidth;
      }, function(val) {
        resetNav(val);
    });
  });

  // init nav change
  resetNav($window.innerWidth);

  // set BASEURL
  if (window.location.origin === 'http://localhost:8000') {
    origin = '/#';
  } else if (window.location.origin === 'http://edwardhotchkiss.github.io') {
    origin = 'http://edwardhotchkiss.github.io/southwest-gas/#';
  } else {
    origin = window.location.origin;
  }
  $log.debug('app(): origin:', origin);
  
  $rootScope.BASE_URL = function (route) {
    return origin + route;
  };

  $rootScope.goTo = function (path) {
    $location.url(path);
  };

  $rootScope.DEVELOPMENT = DEVELOPMENT;
  $rootScope.TEMPLATE_URL = TEMPLATE_URL;

  // initialize sessions
  SessionService.init();

});
