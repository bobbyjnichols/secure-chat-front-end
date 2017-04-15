(function () {
  'use strict';

  var ConversationService = function (WebService, ApiService) {
    this.create = function (name, participants) {
      return WebService.doPost({
        url:'messaging/conversation',
        params: {
          name: name,
          participants: participants
        }
      });
    };

    this.getUsers = function () {
      return WebService.doGetAll({
        url: 'user'
      });
    };
  };

  angular
    .module('SecureChat')
    .service('ConversationService',[
      'WebService',
      'ApiService',
      ConversationService
    ]);
})();
