
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
