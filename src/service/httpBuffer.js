(function () {
  'use strict';

  var HttpBuffer = function ($rootScope, $injector) {
    var ReqBuffer = {
      buffer: []
    };

    ReqBuffer.append = function (obj, deferred) {
      ReqBuffer.buffer.push({
        config: obj,
        deferred: deferred
      });
    };

    ReqBuffer.retryHttpRequest = function (config, deferred, access_token) {

      config.params.access_token = access_token;
      var $http = $http || $injector.get('$http');
      $http(config).then(function (resp) {
        deferred.resolve(resp);
      }, function (error) {
        deferred.reject(error);
      });
    };

    ReqBuffer.retryAll = function (access_token) {
      ReqBuffer.buffer.forEach(function (buffer) {
        ReqBuffer.retryHttpRequest(buffer.config, buffer.deferred, access_token);
      });

      ReqBuffer.buffer = [];
      //console.clear();
    };

    $rootScope.$on("new-access-token", function (event, access_token) {
      ReqBuffer.retryAll(access_token);
    });

    return ReqBuffer;
  };

  angular
      .module("SecureChat")
      .factory("HttpBuffer", [
        '$rootScope',
        '$injector',
        HttpBuffer
      ]);
})();
