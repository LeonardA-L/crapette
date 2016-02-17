'use strict';

/**
 * @ngdoc overview
 * @name cardsApp
 * @description
 * # cardsApp
 *
 * Main module of the application.
 */
angular
  .module('cardsApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'cardsDirectives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/crapette.view.html',
        controller: 'CrapetteCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
