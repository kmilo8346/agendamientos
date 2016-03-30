// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'wt.responsive', 'starter.controllers', 'ngMask'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant('appConf', {})

//Interceptors
.config(function ($httpProvider) { // TODO

})

//routes
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('tab.data', {
      url: '/data',
      templateUrl: 'templates/data.html',
      controller: 'DataCtrl'
    })
    .state('tab.agenda', {
      url: '/agenda',
      templateUrl: 'templates/agenda.html',
      controller: 'AgendaCtrl'
    })
    .state('tab.agenda_sel_date', {
      url: '/agenda_sel_date',
      templateUrl: 'templates/agenda_sel_date.html',
      controller: 'AgendaCtrl'
    })
    .state('tab.agenda_conf', {
      url: '/agenda_conf',
      templateUrl: 'templates/agenda_conf.html',
      controller: 'AgendaCtrl'
    })
    .state('tab.turn', {
      url: '/turn',
      templateUrl: 'templates/turn.html',
      controller: 'TurnCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
