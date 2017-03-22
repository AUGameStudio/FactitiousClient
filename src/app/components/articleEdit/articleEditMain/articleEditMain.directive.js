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

			vm.articleList = [];
			vm.selectedArticleId = 116;
			vm.articleInfo = {};

			fetchArticleInfo(vm.selectedArticleId);

			function fetchArticleInfo(id) {
				articleService.getArticle(id)
					.then(function(articleInfo) {
						vm.articleInfo = articleInfo;

						vm.articleInfo.body = '';
						['chunk1', 'chunk2', 'chunk3'].forEach(function(chunkKey) {
							vm.articleInfo.body += vm.articleInfo[chunkKey].trim()+'\n\n';
						});
						$log.log(vm.articleInfo);
					})
			}
		}
	}
})();