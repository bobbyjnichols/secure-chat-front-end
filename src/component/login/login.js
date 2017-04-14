(function () {
  'use strict';

  var LoginController = function (LoginService, $scope, $state) {
    var self = this;

    this.login = function () {
      $state.go('portal');
      LoginService.login(self.phone, self.password).then(function () {

        console.log($state);
      });
    };

    this.init = function () {
    };

    this.init();
  };

  angular
    .module('SecureChat')
    .service('login',[])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '',
          templateUrl: 'component/login/login.html',
          controllerAs: 'login',
          controller: 'LoginController'
        });
    }])
    .controller('LoginController', [
      'LoginService',
      '$scope',
      '$state',
      LoginController
    ]);
})();
