(function () {
  'use strict';

  var PortalController = function (PortalService, ConStore, $state, $scope) {
    var self = this;

    this.getAbout = function () {
      PortalService.getAbout().then(function (response) {
        self.about = response;
      });
    };

    this.getUserDetails = function () {
      PortalService.getUserDetails().then(function (user) {
        self.userDetails = user;
      });
    };

    this.getConversations = function () {
      PortalService.getConversations().then(function (conversations) {
        self.conversations = conversations;
      });
    };
    
    this.selectConversation = function (conversation) {
      self.selectedConversation = conversation.key;
      self.messages = [];
      PortalService.getMessages(conversation.key).then(function (messages) {
        self.messages = messages.content;
        // var messageDiv = document.getElementById("message-container");
        // console.log(messageDiv.scrollHeight);
        // messageDiv.scrollTop = messageDiv.scrollHeight;
      });
    };

    this.sendMessage = function (message) {
      if (message !== undefined && message !== '')
        PortalService.sendMessage(message, self.selectedConversation).then(function (messageObject) {
          $scope.newMessage = undefined;
          self.messages.push(messageObject);
        });
    };

    this.init = function () {
      PortalService.checkAccessToken();
      self.getUserDetails();
      self.getAbout();
      self.getConversations();
    };

    this.init();
  };

  angular
    .module('SecureChat')
    .service('portal',[])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('portal', {
          url: '/messages',
          templateUrl: 'component/portal/portal.html',
          controllerAs: 'portal',
          controller: 'PortalController'
        });
    }])
    .controller('PortalController', [
      'PortalService',
      'ConStore',
      '$state',
      '$scope',
      PortalController
    ]);
})();
