
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
