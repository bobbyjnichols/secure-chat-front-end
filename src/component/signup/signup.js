(function () {
  'use strict';

  var SignupController = function (SignupService, $scope, $state) {
    var self = this;

    this.signup = function () {
      SignupService.signup(self.phone, self.password).then(function () {
        $state.go('login');
      });
    };

    this.init = function () {
    };

    this.init();
  };

  angular
    .module('SecureChat')
    .service('signup',[])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('signup', {
          url: '/signup',
          templateUrl: 'component/signup/signup.html',
          controllerAs: 'signup',
          controller: 'SignupController'
        });
    }])
    .controller('SignupController', [
      'SignupService',
      '$scope',
      '$state',
      SignupController
    ]);
})();
