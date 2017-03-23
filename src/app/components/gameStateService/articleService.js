(function() {
	'use strict';

	angular.module('fact2')
		.service('articleService', articleService);

	/** @ngInject */
	function articleService($log, $http) {
		var serviceUrl = "api/article/";

		var deprecatedDBase = true;

		var service = {
			getArticle: getArticle,
			getArticleList: getArticleList
		};

		return service;

		function getArticle(articleId) {
			if (angular.isString(articleId)) {
				if (articleId[0]==='A') {
					articleId = articleId.substr(1);
				}
				articleId = 1*articleId;
			}
			return $http.get(serviceUrl+articleId)
				.then(function(response) {
					var article = response.data;

					if (deprecatedDBase) {
						article.body = '';
						['chunk1', 'chunk2', 'chunk3'].forEach(function(chunkKey) {
							article.body += article[chunkKey].trim()+'\n\n';
						});

					}
					return article;
				});
		}

		function getArticleList() {
			return $http.get(serviceUrl+'list')
				.then(function(response) {
					return response.data;
				});
		}
	}
})();