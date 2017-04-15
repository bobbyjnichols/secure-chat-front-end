(function () {
  'use strict';

  var ConversationController = function (ConversationService, PortalService, $rootScope, $state, $q) {
    var self = this;

    this.name = undefined;
    this.participants = [];
    this.users = [];

    this.checkForUserDetails = function () {
      if ($rootScope.userDetails === undefined)
        PortalService.getUserDetails().then(function (user) {
          $rootScope.userDetails = user;
        });
    };

    this.create = function () {
      var participants = self.participants.map(function (participant) {
        return participant.key;
      });
      participants.push($rootScope.userDetails.key);
      ConversationService.create(self.name, participants).then(function () {
        $state.go('portal');
      });
    };

    this.searchUsers = function (query) {
      var defer = $q.defer();
      var results = [];
      query = query.toLowerCase();
      self.getUsers().then(function (users) {
        results = users.filter(function (user) {
          return (user.firstName.toLowerCase().includes(query) ||
                  user.lastName.toLowerCase().includes(query) ||
                  user.email.toLowerCase().includes(query) ||
                  user.phone.toLowerCase().includes(query)) &&
                  $rootScope.userDetails.key !== user.key;
        });
        defer.resolve(results);
      });
      return defer.promise;
    };

    this.getUsers = function () {
      var defer = $q.defer();
      if (self.users.length > 0) {
        defer.resolve(self.users);
      } else {
        ConversationService.getUsers().then(function (users) {
          self.users = users;
          defer.resolve(users);
        }, function (error) {
          defer.reject(error);
        });
      }
      return defer.promise;
    };

    this.init = function () {
      self.checkForUserDetails();
    };

    this.init();
  };

  angular
    .module('SecureChat')
    .service('conversation',[])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('conversation', {
          url: '/conversation',
          templateUrl: 'component/conversation/conversation.html',
          controllerAs: 'conversation',
          controller: 'ConversationController'
        });
    }])
    .controller('ConversationController', [
      'ConversationService',
      'PortalService',
      '$rootScope',
      '$state',
      '$q',
      ConversationController
    ]);
})();
