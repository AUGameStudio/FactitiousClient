(function() {
	'use strict';

	angular.module('fact2')
		.service('articleService', articleService);

	/** @ngInject */
	function articleService($log, $http, $q) {
		var serviceUrl = "/api/article/";

		var deprecatedDBase = true;

		var service = {
			getArticle: getArticle,
			getArticleList: getArticleList,

			putArticle: putArticle,
			getArticleImageForPreview: getArticleImageForPreview,
			putArticleImage: putArticleImage

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
						cleanUpDeprecatedArticle(article);
					}

					return article;
				});
		}

		function putArticle(article) {
			return $http.post(serviceUrl+'postarticle/', article, {headers: {'Authorization': 'Token eda1f570f59ec076dc3e48ec05e5ca7e13117dca'}})
				.then(function(response) {
					$log.log('success');
					$log.log(response);
				},
				function(response) {
					$log.log('failed');
					$log.log(response);
				});
		}

		function getArticleImageForPreview(fileObject) {
			var deferred = $q.defer();
			var r = new FileReader();

			r.onloadend = function(e){
				var data = e.target.result;
				deferred.resolve(data);
			}
			r.readAsDataURL(fileObject);

			return deferred.promise;
		}

		function putArticleImage(fileObject, pk) {
			var formData = new FormData();

			formData.append('photo', fileObject);
			formData.append('pk', pk);

			var request = {
				method: 'POST',
				url: serviceUrl+'postarticleimage/',
				data: formData,
				headers: {
					'Content-Type': undefined,
					'Authorization': 'Token eda1f570f59ec076dc3e48ec05e5ca7e13117dca'
               	}				
			};

			return $http(request)
					.then(function(response) {
						$log.log('success');
						$log.log(response);
					},
					function(response) {
						$log.log('success');
						$log.log(response);
					});

		}

		function getArticleList() {
			return $http.get(serviceUrl+'list')
				.then(function(response) {
					return response.data;
				});
		}

		function stripEolNonsense(article) {
			var textBodyKeys = ['headline', 'body', 'showSourceHint', 'sourceName', 'payoffText'];

			textBodyKeys.forEach(function(textKey) {
				article[textKey] = article[textKey].replace(/\r\n/g, '\n');
			});
		}


		function cleanUpDeprecatedArticle(article) {
			// fix up this crazy junk, for god's sake...

			article.articleType = (article.article_type==='news' ? 'news' : 'notNews');


			article.body = '';
			['chunk1', 'chunk2', 'chunk3'].forEach(function(chunkKey) {
				article.body += article[chunkKey].trim()+'\n\n';
			});
			article.body = article.body.trim();

			article.showSourceHint = article.info.source
										.split('\n')
										.filter(isNotBlank)
										.join('\n\n').trim();

			article.sourceUrl = article.source_URL;

			article.sourceName = '';
			article.payoffText = '';

			if (article.info.references) {
				var refLines = article.info.references.split('\n');
				var sourceName = refLines[0];

				if (sourceName.indexOf('Source')>=0) {
					refLines = refLines.slice(1);
					article.sourceName = sourceName.replace('Source:', '').trim();
					article.sourceUrl = article.source_URL.split('\n')[0];
					if (article.sourceUrl) {
						article.sourceUrl = article.sourceUrl.replace(/"/g, '');
						if (article.sourceUrl.indexOf('http')!==0) {
							article.sourceUrl = 'http://'+article.sourceUrl;
						}

						
					}
				}

				article.payoffText = refLines.filter(isNotBlank)
									.join('\n\n').trim();

			}

			stripEolNonsense(article);

			function isNotBlank(item) {
				return item.trim().length>0;
			}


		}
	}
})();