(function () {
  'use strict';

  var AppController = function ($logProvider, $locationProvider, $urlRouterProvider, ConStore) {

    $logProvider.debugEnabled(ConStore.debugInfoEnabled);

    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/login');

  };

  angular.module('SecureChat', [
    'ui.router',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'config',
    'luegg.directives'
  ]).config([
    '$logProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'ConStore',
    AppController
  ]);
})();
