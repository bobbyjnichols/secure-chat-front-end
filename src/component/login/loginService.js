(function () {
  'use strict';

  var LoginService = function (WebService, ApiService, TokenService) {
    this.login = function (phone, password) {
      return WebService.doPost({
        url:'oauth/token',
        params: {
          client_id:'dev-client',
          grant_type: 'password',
          username: phone,
          password: password
        },
        headers: {'Authorization': 'Basic ' + ApiService.authHeader}
      }).then(function (tokens) {
        console.log(tokens);
        TokenService.storeToken(tokens.refresh_token);
        ApiService.token = tokens.access_token;
        sessionStorage.setItem('accessToken', tokens.access_token);
      });
    };
  };

  angular
    .module('SecureChat')
    .service('LoginService',[
      'WebService',
      'ApiService',
      'TokenService',
      LoginService
    ]);
})();
