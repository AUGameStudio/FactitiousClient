(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleEditMain', articleEditMain)
		.directive('textarea', cleanEol);

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

			var cleanArticle;

			vm.articleList = [];
			vm.selectedArticleId = '';

			vm.articleExpanded = true; // always show source area
			vm.article = {};
			// vm.articleType = 'notNews'; // helper for backward compatibility

			vm.simClasses = [
				{simClass: 'sim-iPhone5s', label: 'iPhone 5s'},
				{simClass: 'sim-iPhone6', label: 'iPhone 6'},
				{simClass: 'sim-iPhone6sP', label: 'iPhone 6s+'},
				{simClass: 'sim-iPhone6sPChrome', label: 'iPhone 6s+ Chrome'},
				{simClass: 'sim-galaxyS7', label: 'galaxy S7'},
				{simClass: 'sim-pixel7', label: 'Pixel 7.1'}
			];
			vm.simClass = vm.simClasses[0].simClass;

			vm.showHint = showHint;
			vm.selectImage = selectImage;
			vm.onChange = onChange;
			vm.revertArticle = revertArticle;


			fetchArticleList()
				.then(function() {
					vm.selectedArticleId = vm.articleList[0].article_id;
				});

			$scope.$watch(function() {return vm.selectedArticleId; }, function() {
				$log.log('select article: '+ vm.selectedArticleId);
				if (vm.selectedArticleId) {
					fetchArticleInfo(vm.selectedArticleId)
						.then(function() {
							$('.article-card').scrollTop(0);
							// vm.articleExpanded = false; // always show source area

							cleanArticle = angular.copy(vm.article);
						});
				}
			});

			$scope.$watch(function() {return angular.toJson(vm.article); }, function(newJson) {
				vm.articleHasChanged = newJson!==angular.toJson(cleanArticle);
				$log.log('dirty '+vm.articleHasChanged);
			});

			function onChange() {
				$log.log('changed');
			}

			function showHint() {
				vm.articleExpanded = true;
			}

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
				return articleService.getArticle(id)
					.then(function(article) {
						vm.article = article;

						/*
						vm.article.body = '';
						['chunk1', 'chunk2', 'chunk3'].forEach(function(chunkKey) {
							vm.article.body += vm.article[chunkKey].trim()+'\n\n';
						});
						*/
						
						$log.log(vm.article);
					})
			}

			function selectImage(fileObject) {
				$log.log('articleEditMain: Upload Image');
				$log.log(fileObject);
				vm.article.photo_url = URL.createObjectURL(fileObject);
				$log.log(vm.article.photo_url);
			}

			function revertArticle() {
				fetchArticleInfo(vm.selectedArticleId)
					.then(function() {
						$('.article-card').scrollTop(0);
						// vm.articleExpanded = false; // always show source area
						cleanArticle = angular.copy(vm.article);
					});
			}
		}
	}

	/** @ngInject */
	function cleanEol($log) {
		return {
			restrict: 'E',
			link: link
		};

		function link(scope,elm,attrs) {
			elm.on('input onpropertychange', function() {
				elm[0].value = elm[0].value.replace(/\r\n/g, '\n');
			})
		}
	}
})();