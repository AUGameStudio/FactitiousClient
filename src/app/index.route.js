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

      .state('manageHome', {
        url: '/manage',
        // templateUrl: 'app/main/articleEdit.html'
        template: '<manage-home></manage-home>'
      })

      .state('manageLogin', {
        url: '/login',
        // templateUrl: 'app/main/articleEdit.html'
        template: '<login-page></login-page>'
      })

      .state('articleEdit', {
        url: '/editor',
        template: '<article-edit-main></article-edit-main>'
      })

      .state('gameSettingsEdit', {
        url: '/gameSettings',
        // templateUrl: 'app/main/articleEdit.html'
        template: '<game-settings-editor></game-settings-editor>'
      })

      .state('statisticsPage', {
        url: '/statistics',
        // templateUrl: 'app/main/articleEdit.html'
        template: '<statistics-page></statistics-page>'
      })

      ;

    $urlRouterProvider.otherwise('/');
  }

})();
