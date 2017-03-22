(function() {
  'use strict';

  angular
    .module('fact2')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('articleEdit', {
        url: '/',
        templateUrl: 'app/main/articleEdit.html'
      })

      ;

    $urlRouterProvider.otherwise('/');
  }

})();
