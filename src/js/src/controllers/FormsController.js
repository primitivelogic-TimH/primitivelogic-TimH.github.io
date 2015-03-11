
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
