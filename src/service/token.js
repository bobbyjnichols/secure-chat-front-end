(function () {
  'use strict';

  var tokenService = function ($rootScope, $cookies, ConStore) {
    var TokenManager = {};
    var tokenName = 'refreshToken';

    TokenManager.storeToken = function (token) {
      var expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + ConStore.tokenLife);
      $cookies.put(tokenName, token, {expires: expireTime});
    };

    TokenManager.getToken = function () {
      return $cookies.get(tokenName);
    };

    TokenManager.removeToken = function () {
      sessionStorage.removeItem('accessToken');
      return $cookies.remove(tokenName);
    };

    TokenManager.hasRefreshToken = function () {
      return TokenManager.getToken() !== undefined;
    };

    return TokenManager;
  };

  angular
      .module('SecureChat')
      .factory('TokenService', [
        '$rootScope',
        '$cookies',
        'ConStore',
        tokenService
      ]);
})();
