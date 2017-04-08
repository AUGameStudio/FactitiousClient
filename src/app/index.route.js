(function() {
  'use strict';

  angular
    .module('fact2')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/newMain.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('preview', {
        url: '/preview',
        templateUrl: 'app/main/newMain.html',
        controller: 'MainController',
        controllerAs: 'main',
        params: {
          isPreview: true
        }
      })

      .state('articleEdit', {
        url: '/editor',
        // templateUrl: 'app/main/articleEdit.html'
        template: '<article-edit-main></article-edit-main>'
      })

      ;

    $urlRouterProvider.otherwise('/');
  }

})();
