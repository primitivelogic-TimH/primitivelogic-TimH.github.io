
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

