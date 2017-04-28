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
			templateUrl: 'app/components/managementPages/articleEdit/articleEditMain/articleEditMain.html'
		};

		function controller($scope) {
			var vm = this;

			var cleanArticle;

			vm.articleList = [];
			vm.selectedArticleId = '';

			vm.articleExpanded = true; // always show source area
			vm.article = {};
			vm.curProgress = 0;
			vm.maxProgress = 10;
			vm.progressPips = [];
			for (var i=0; i<vm.maxProgress; i++) {
				vm.progressPips.push('');
			}

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
			vm.saveArticle = saveArticle;
			vm.addArticle = addArticle;


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
					});
			}

			function fetchArticleInfo(id) {
				return articleService.getArticle(id)
					.then(function(article) {
						vm.article = article;
					})
			}

			function selectImage(fileObject) {
				$log.log('articleEditMain: Select Image');
				$log.log(fileObject);

				vm.article.photo_url = URL.createObjectURL(fileObject);
				vm.article.photoFileObject = fileObject;

			}

			function revertArticle() {
				fetchArticleInfo(vm.selectedArticleId)
					.then(function() {
						$('.article-card').scrollTop(0);
						// vm.articleExpanded = false; // always show source area
						cleanArticle = angular.copy(vm.article);
					});
			}

			function saveArticle() {
				vm.uploading = true;
				return articleService.putArticle(vm.article)
					.then(function(article) {
						$log.log('success saving');
						var origPk = vm.article.pk;
						vm.article = article;
						cleanArticle = angular.copy(vm.article);
						vm.articleHasChanged = false;
						fetchArticleList()
							.then(function() {
								vm.selectedArticleId = vm.article.article_id;
							});
						vm.uploading = false;
					},
					function(result) {
						$log.log('failure');
						vm.uploading = false;
					});
			}

			function addArticle() {
				return articleService.getBlankArticle()
					.then(function(article) {
						vm.article = article;
						vm.selectedArticleId = undefined;
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