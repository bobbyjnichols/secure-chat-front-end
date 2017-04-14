(function () {
  'use strict';

  var apiService = function ($log, $q, webService, conStore, TokenService, $timeout, $rootScope, $state) {
    var APIManager = {};
    var self = this;
    APIManager.authHeader = btoa("dev-client:1234");
    APIManager.token = sessionStorage.getItem('accessToken');

    $rootScope.$on("token-needed", function (event, data) {
      APIManager.getNewAccessToken();
    });

    $rootScope.$on("login-required", function (event, data) {
      $rootScope.invalidCredentialsMessage = true;
      $rootScope.modal = false;
      console.log("Login Required");
      $state.go('login', {
        redirect: {
          state: $state.$current.self.name,
          params: $state.params
        }
      });
    });

    $rootScope.$on("auth-failed", function (event, data) {
      TokenService.removeToken();
      $rootScope.modal = false;
    });

    APIManager.getAccessToken = function () {
      return APIManager.token;
    };

    APIManager.getNewAccessToken = function () {
      var deferred = $q.defer();
      var networkConfig = {
        'url': 'oauth/token',
        'params': {'grant_type': 'refresh_token', 'refresh_token': TokenService.getToken()},
        'headers': {'Authorization': 'Basic ' + APIManager.authHeader}
      };

      if (TokenService.getToken() === undefined) {

      }
      webService.doPost(networkConfig).then(function (resp) {
        TokenService.storeToken(resp.refresh_token);
        APIManager.token = resp.access_token;
        sessionStorage.setItem('accessToken', resp.access_token);
        $rootScope.$broadcast("new-access-token", resp.access_token);
        deferred.resolve(resp);
      }, function (error) {
        console.warn(error);
        $rootScope.$broadcast("auth-failed");
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return APIManager;

  };

  angular
    .module("SecureChat")
    .factory('ApiService', [
      '$log',
      '$q',
      'WebService',
      'ConStore',
      'TokenService',
      '$timeout',
      '$rootScope',
      '$state',
      apiService
    ]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', 'HttpBuffer', '$injector', 'TokenService', 'ConStore',
      function ($rootScope, $q, httpBuffer, $injector, TokenService, ConStore) {
        return {
          request: function (request) {
            if (request.url.indexOf(ConStore.apiServer) !== -1) {
              if (request.params)
                request.params.access_token = sessionStorage.getItem('accessToken');
              else
                request.params = {
                  access_token: sessionStorage.getItem('accessToken')
                };
            }
            return request;
          },
          responseError: function (rejection) {
            if (rejection.data && rejection.data.error === 'invalid_grant') {
              TokenService.removeToken();
              $rootScope.$broadcast("login-required");
              return $q.reject(rejection);
            }
            if (rejection.data && rejection.data.error === 'invalid_token') {
              var defered = $q.defer();
              httpBuffer.append(rejection.config, defered);
              if ($injector.get("$http").pendingRequests.length < 1) {
                $rootScope.$broadcast("token-needed");
              }
              return defered.promise;
            }
            if (rejection.data && rejection.data.error === 'unauthorized') {
              if (TokenService.hasRefreshToken()) {
                if (rejection.data.error_description === 'Full authentication is required to access this resource')
                  $rootScope.$broadcast("login-required");
                return $q.reject(rejection);

              }
              else {
                $rootScope.$broadcast("login-required");
              }
            }
            return $q.reject(rejection);
          }
        };
      }]);
  }]);
})();

