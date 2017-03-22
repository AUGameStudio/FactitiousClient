(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleEditMain', articleEditMain);

	/** @ngInject */
	function articleEditMain($log, articleService) {
		return {
			restrict: 'E',
			controller: controller,
			controllerAs: 'main',
			bindToController: true,
			templateUrl: 'app/components/articleEdit/articleEditMain/articleEditMain.html'
		};

		function controller($scope) {
			var vm = this;

			vm.state = "showArticle"

			vm.articleList = [];
			vm.selectedArticleId = '';
			vm.articleExpanded = true; // always show source area
			vm.article = {};

			fetchArticleList()
				.then(function() {
					vm.selectedArticleId = vm.articleList[0].article_id;
					// fetchArticleInfo(vm.articleList[0].article_id);
				});

			$scope.$watch(function() {return vm.selectedArticleId; }, function() {
				$log.log('select article: '+ vm.selectedArticleId);
				if (vm.selectedArticleId) {
					fetchArticleInfo(vm.selectedArticleId);
				}
			});

			function fetchArticleList() {
				return articleService.getArticleList()
					.then(function(articleList) {
						var maxLen = 60;
						articleList.forEach(function(article) {
							article.label = article.article_id+': '+(article.headline.length< maxLen ? article.headline : article.headline.substr(0,maxLen)+'...');
						})
						vm.articleList = articleList;

						$log.log(articleList);
					});
			}

			function fetchArticleInfo(id) {
				articleService.getArticle(id)
					.then(function(article) {
						vm.article = article;

						vm.article.body = '';
						['chunk1', 'chunk2', 'chunk3'].forEach(function(chunkKey) {
							vm.article.body += vm.article[chunkKey].trim()+'\n\n';
						});
						$log.log(vm.article);
					})
			}
		}
	}
})();