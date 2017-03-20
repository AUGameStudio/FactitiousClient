(function() {
	'use strict';

	angular.module('fact2')
		.service('articleService', articleService);

	/** @ngInject */
	function articleService($log, $http) {
		var serviceUrl = "api/article/";

		var service = {
			getArticle: getArticle
		};

		return service;

		function getArticle(articleId) {
			return $http.get(serviceUrl+articleId)
				.then(function(response) {
					return response.data;
				});
		}
	}
})();