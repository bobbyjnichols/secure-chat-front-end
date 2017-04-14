(function () {
  'use strict';

  var SignupService = function (WebService, ApiService) {
    this.signup = function (phone, password) {
      return WebService.doPost({
        url:'signup',
        params: {
          phone: phone,
          password: password
        },
        headers: {'Authorization': 'Basic ' + ApiService.authHeader}
      });
    };
  };

  angular
    .module('SecureChat')
    .service('SignupService',[
      'WebService',
      'ApiService',
      SignupService
    ]);
})();
