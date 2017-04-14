(function () {
  'use strict';

  var PortalService = function (WebService, ApiService, $q) {
    this.getAbout = function () {
      return WebService.doGet({
        url: 'about'
      });
    };

    this.checkAccessToken = function () {
      var deferred = $q.defer();
      if (ApiService.getAccessToken()) {
        deferred.resolve(ApiService.getAccessToken());
      } else {
        ApiService.getNewAccessToken().then(function (resp) {
          deferred.resolve(resp);
        }, function (error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    };

    this.getUserDetails = function () {
      return WebService.doGet({
        url:'profile'
      });
    };

    this.getConversations = function () {
      return WebService.doGetAll({
        url: 'messaging/conversation'
      });
    };

    this.getMessages = function (conversation) {
      return WebService.doGet({
        url: 'messaging/' + conversation,
        params: {
          page: 0
        }
      });
    };

    this.sendMessage = function (message, conversation) {
      return WebService.doPost({
        url: 'messaging/message',
        params: {
          conversation: conversation,
          message: message
        }
      });
    };
  };

  angular
    .module('SecureChat')
    .service('PortalService',[
      'WebService',
      'ApiService',
      '$q',
      PortalService
    ]);
})();
