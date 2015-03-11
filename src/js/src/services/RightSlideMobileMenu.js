
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
