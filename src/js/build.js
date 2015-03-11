
angular.module('app.directives', [
  'app.directives.static_popover',
  'app.directives.right_side_nav',
  'app.directives.json_text'
]);


angular.module('app.services', [
  'app.services.alerts',
  'app.services.right_slide_mobile_menu',
  'app.services.session_service',
  'app.services.api'
]);


/**
 * "name": "Joe Smith"
 * "state": "NV"
 * "zip": "89129",
 * "type": "P",  // (account type P=personal, B=business)
 * AccountPermissions[{
 *    OTP=OK,  // eligible for onetime payment  
 *    NRG=OK, // eligible for energy share  
 *    OWN=OK, // owner of the account (myaccount specific)
 *    ADD=AccountAlreadyAssociated,  // eligible for myaccount (myaccount specific)
 *    APP=OK,  // eligible for automated payment plan  
 *    PE=OK, // eligible for payment extention
 *    LIRA=AccountNotInArizona, // eligible for LIRA (AZ customers only)
 *    APPCanEnroll=OK, // can enroll in APP
 *    CARE=AccountNotInCalifornia, // eligible for CARE (CA customers only)
 *    APPCanTerminate=AppNotEnrolled, // can terminate APP (myaccount specific)
 *    EPPCanEnroll=OK, // can enroll for EPP      
 *    EPP=OK, // eligible for equal payment plan
 *    EPPCanTerminate=EppNotEnrolled, // can terminate EPP (myaccount specific)
 *    SSM=OK, // eligible for stop, start or move transaction
 *    PAP=OK // eligible for paperless billing
 * }]
 */

angular.module('app.services.session_service', []).factory('SessionService', function($rootScope, $log, $cookies) {
  
  $log.debug('SessionService(): loading');

  var _sessionService = {};

  _sessionService.init = function () {
    $log.debug('SessionService(): init()');
    $rootScope.session = this.getLocalSession();
  };

  _sessionService.getLocalSession = function () {
    $log.debug('SessionService(): getLocalSession():', $cookies.session || {});
    return $cookies.session || {};
  };

  _sessionService.setLocalSession = function (session) {
    $log.debug('SessionService(): setLocalSession():', session);
    $cookies.session = session;
    $rootScope.session = session;
  };

  _sessionService.deleteLocalSession = function () {
    $log.debug('SessionService(): deleteLocalSession()');
    if (!$rootScope.session) {
      $cookies.session = null;
      delete $rootScope.session;
    }
  };

  $rootScope.$on('loginSessionExpired', function (evt, data, fn) {
    _sessionService.deleteLocalSession();
    if (fn) {
      $apply(fn);
    }
  });

  return _sessionService;

});


angular.module('app.services.alerts', []).factory('AlertsService', ['$rootScope','$log', function($rootScope, $log) {

  'use strict';

  return {

    /** 
     * @list alerts
     * @description list of alerts in queue
     */

    alerts: [],

    /**
     * @public get
     * @description retrieve list of alerts for local scoping
     */

    get: function () {
      return this.alerts;
    },

    /**
     * @public add
     * @description add an alert to the stack
     * @param {String/Enum} "type" warning, danger, info
     * @param {String} "msg" message to display
     * @option cb optional code to execute on alert/notification
     */

    add: function (alert /*, cb */) {
      // broadcast and scope
      $rootScope.$broadcast('push_down_menu', { "open" : true });
      this.alerts.push(alert);
      // cb
      if (arguments.length === 3) {
        arguments[2].apply(this, this.arguments);
      }
      // broadcast alert change
      $rootScope.$broadcast('alerts_update', this.alerts);
    },

    /**
     * @public remove
     * @description remove an alert from the list
     * @param {Number} "index" warning, danger, info
     */

    remove: function (index) {
      // remove and broadcast
      this.alerts.splice(index, 1);
      $rootScope.$broadcast('push_down_menu', { "open" : false });
      // broadcast alert change
      $rootScope.$broadcast('alerts_update', this.alerts);
    }

  };

}]);


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


angular.module('app.services.right_slide_mobile_menu', []).factory('MobileMenu', ['$window','$document','$rootScope','$log','$timeout', function($window, $document, $rootScope, $log, $timeout) {
  
  return {
    
    on: false,
    nav: null,
    body: null,
    width: null,
    height: null,
    dimensionsSet: false,
    navContentOverlay: null,
    containerCanvas: null,

    // init, select dom elements
    init: function () {
      this.nav = angular.element(document.querySelector('nav.collapse'));
      this.body = angular.element(document.querySelector('body'));
      this.navContentOverlay = angular.element(document.querySelector('nav.nav-content-overlay'));
      this.containerCanvas = angular.element(document.querySelector('.container-canvas'));
    },

    // set height as needeed
    setDimensions: function () {
      this.body.css('overflow-x', 'hidden');
      this.width = this.containerCanvas[0].offsetWidth;
      this.height = this.containerCanvas[0].offsetHeight;
      this.sizeOffset = (this.width < 400) ? (360 - this.width) : -40;
      this.nav.css('height', this.height + 'px');
      this.nav.css('width', (420 - this.sizeOffset) + 'px');
      this.navContentOverlay.css('width', (420 - this.sizeOffset) + 'px');
      this.navContentOverlay.css('height', this.height + 'px');
      this.dimensionsSet = true;
    },

    // toggle nav
    toggle: function () {
      var context = this;
      if (!this.dimensionsSet) {
        context.setDimensions();
        setTimeout(function () {
          context.toggle();
        }, 250);
        return;
      }
      this.on = !this.on;
      if (this.on) {
        $log.debug('MobileMenu(): toggling menu on');
        this.nav.css('right', '-' + (430 - this.sizeOffset) + 'px');
        this.navContentOverlay.css('right', '-' + 8 + 'px');
        this.containerCanvas.css('right', (300 - this.sizeOffset) + 'px');
      } else {
        $log.debug('MobileMenu(): toggling menu off');
        this.nav.css('right', '-' + (440 - this.sizeOffset) + 'px');
        this.navContentOverlay.css('right', '-' + (440 - this.sizeOffset) + 'px');
        this.containerCanvas.css('right', 'inherit  ');
      }
    }

  };

}]);


angular.module('app.controllers', [
  'app.controllers.nav',
  'app.controllers.home',
  'app.controllers.forms',
  'app.controllers.alerts',
  'app.controllers.safety',
  'app.controllers.rebates_and_promotions',
  'app.controllers.master',
  'app.controllers.footer',
  'app.controllers.sticky_nav'
]);


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



angular.module('app.controllers.footer', []).controller('FooterController', function ($scope, $log) {
  
  'use strict';

  $log.debug('FooterController()');

  $scope.copyrightYear = (new Date()).getFullYear();

});


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


angular.module('app.controllers.home', []).controller('HomeController', ['$rootScope','$scope','$log','$templateCache', function ($rootScope, $scope, $log, $templateCache) {
  
  'use strict';

  $log.debug('HomeController()');

  // bottom page footer, community focused carousel
  $scope.community_slides = [
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' },
    { image : 'images/home/footer_rotating_01.png' }
  ];

}]);


angular.module('app.controllers.safety', []).controller('SafetyController', ['$rootScope','$scope','$log','$templateCache', function ($rootScope, $scope, $log, $templateCache) {
  
  'use strict';

  $log.debug('SafetyController()');

  $scope.hero_slides = [
    { image : 'images/home/hero_rotating_01.png' },
    { image : 'images/home/hero_rotating_02.png' },
    { image : 'images/home/hero_rotating_03.png' },
    { image : 'images/home/hero_rotating_04.png' },
    { image : 'images/home/hero_rotating_05.png' },
    { image : 'images/home/hero_rotating_06.png' },
    { image : 'images/home/hero_rotating_07.png' }
  ];

  // hijack ui bootstraps template and override
  $templateCache.put('template/carousel/carousel.html',
    '<div class="container-carousel-custom">' +
      '<a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span><img src="images/shared/carousel_arrow_green_left.png" /></span></a>' +
      '<a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span><img src="images/shared/carousel_arrow_green_right.png" /></span></a>' +
      '<ol class="carousel-indicators" ng-show="slides.length > 1">' +
          '<li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>' +
        '</ol>' +
      '<div class="container" ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()" hm-swipe-left="next();" hm-swipe-right="prev();">' +
        '<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
          '<div class="carousel-inner" ng-transclude></div>' +
          '</div></div>' +  
      '</div>' +
    '</div>');

  $templateCache.put('template/carousel/slide.html',
    "<div ng-class=\"{" +
    "    'active': leaving || (active && !entering)," +
    "    'prev': (next || active) && direction=='prev'," +
    "    'next': (next || active) && direction=='next'," +
    "    'right': direction=='prev'," +
    "    'left': direction=='next'" +
    "  }\" class=\"item\" ng-transclude></div" +
    "");

  $scope.activeState = [true, false, false];
  
  $scope.nextSlide = function () {
    var activeIndex = $scope.activeState.indexOf(true);
    if (activeIndex >= $scope.activeState.length - 1) {
      return;
    }
    $scope.activeState[activeIndex] = false;
    $scope.activeState[activeIndex + 1] = true;
  };

  // setup the right side nav data, lays out links to deep link/anchor/toggle
  $scope.items = [
    {
      title   : 'Leak Recognition',
      linksTo : 'safety-awareness'
    },
    { 
      title   : 'Call 811',
      linksTo : 'safety-call-811'
    },
    { 
      title   : 'Appliance Safety',
      linksTo : 'appliance-safety'
    },
    { 
      title   : 'Buried Piping',
      linksTo : 'safety-customer-buried-piping'
    },
    { 
      title   : 'Carbon Monoxide',
      linksTo : 'safety-carbon-monoxide'
    },
    { 
      title   : 'Excess Flow',
      linksTo : 'safety-excess-flow-valves'
    },
    { 
      title   : 'Safety Tubing',
      linksTo : 'safety-tubing'
    },
    { 
      title   : 'Snow Precaution',
      linksTo : 'safety-snow-precaution'
    },
    { 
      title   : 'Earthquakes',
      linksTo : 'safety-earthquakes'
    },
    { 
      title   : 'Sewer Work',
      linksTo : 'safety-work'
    },
    { 
      title   : 'Identify Employees',
      linksTo : 'safety-identify-employee'
    },
    { 
      title   : 'Data Sheet',
      linksTo : 'safety-material-data-sheet'
    },
    { 
      title   : 'Evacuation Steps',
      linksTo : 'safety-additional-resources'
    }
  ]; 

  // broadcast when items come into viewport
  $scope.becameInView = function (id) {
    $rootScope.$broadcast('became_in_view', id);
  };

}]);



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


angular.module('app.controllers.forms', [])
  .controller('FormsController', function ($scope, $rootScope, $location, $log, API) {

    // Matt: Is this controller used?
    'use strict';

    $log.debug('FormsController()');

    $scope.defaultForm = {};

    $scope.dataLoaded = true;

    $scope.submit = function () {
      var promise = API.get(null, $scope.defaultForm);
      promise.success(function (data) {
        $log.debug('FormsController(): success: data:', data);
      }).error(function (data) {
        $log.error('FormsController(): error: data:', data);
      });
    };
  })
  .controller('EmailUsController', function($scope, $log) {
    $scope.submit = function() {

      var firstName = $scope.firstname;
      var lastName = $scope.lastname;
      var address = $scope.address;
      var city = $scope.city;
      var state = $scope.state;
      var zip = $scope.zipcode;
      var phone = $scope.phonenum;
      var email = $scope.email;
      var subject = $scope.subject;
      var division = $scope.division;
      var accountNumber = $scope.account;
      var lastFourDigitsOfSsn = $scope.ssn;
      var comments = $scope.comments;

      $.ajax({
        url: "http://wcsdev.swgas.com/SwgasWs-0.1/rest/form/emailus/addEmail"
        ,type: "post"
        ,data: {
          "firstName": firstName,
          "lastName": lastName,
          "address": address,
          "city": city,
          "state": state,
          "zip": zip,
          "phone": phone,
          "email": email,
          "subject": subject,
          "division": division,
          "accountNumber": accountNumber,
          "lastFourDigitsOfSsn": lastFourDigitsOfSsn,
          "comments": comments
          }
        });
    };
  });


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


angular.module('app.controllers.master', []).controller('MasterController', ['$cookies','$scope','$log', function ($cookies, $scope, $log) {
  
  'use strict';

  $log.debug('MasterController()');

}]);


angular.module("app.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/right-side-nav.html","\r\n<div id=\'right-side-nav\' ng-class=\'{ \"nav-init\" : init }\'>\r\n  <ul>\r\n    <li class=\'arrow\' ng-class=\'{ \"arrow-cloaked\" : (current === 0) }\'>\r\n      <a title=\'Scroll Up\' ng-click=\'prev()\'>\r\n        <i class=\'glyphicon glyphicon-chevron-up\'></i>\r\n      </a>\r\n    </li>\r\n    <li class=\'item\' ng-repeat=\'item in items track by $index\' ng-class=\'{ \"active\" : isActiveSection(item.linksTo) }\'>\r\n      <div class=\'item-body\' ng-click=\'scrollTo($index)\'>\r\n        <div class=\'item-number\'>\r\n          <p>{{ $index + 1 }}</p>\r\n        </div>\r\n        <div class=\'item-title\'>\r\n          <p>{{ item.title }}</p>\r\n        </div>\r\n      </div>\r\n    </li>\r\n    <li class=\'arrow\' ng-class=\'{ \"arrow-cloaked\" : (current === items.length - 1) }\'>\r\n      <a title=\'Scroll Down\' ng-click=\'next()\'>\r\n        <i class=\'glyphicon glyphicon-chevron-down\'></i>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</div>\r\n");
$templateCache.put("templates/static-popover.html","\r\n<div class=\'static-popover-style-bg\'>\r\n  <div class=\'static-popover-style-bg-top\'>\r\n    <h2 ng-bind=\'title\'></h2>\r\n  </div>\r\n  <div class=\'static-popover-style-bg-bottom\'>\r\n    <i class=\'glyphicon glyphicon-play\'></i>\r\n  </div>\r\n</div>\r\n");}]);

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
