(function() {
	'use strict';

	angular.module('fact2')
		.directive('statisticsPage', statisticsPage);

	/** @ngInject */
	function statisticsPage($log, dataTracking, gameSettings) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/statistics/statisticsPage.html'
		};

		function controller($scope) {
			var allGameArticles = [];
			$scope.currentGameOnly = true;

			gameSettings.getSettings()
				.then(function() {
					
					allGameArticles = [];
					gameSettings.roundInfo.forEach(function(round) {
						allGameArticles = allGameArticles.concat(round.articleIds);
					});

					$scope.startDate = new Date(gameSettings.modified_date);
					$scope.endDate = new Date();

					dataTracking.getArticleStatistics()
						.then(function(stats) {
							$scope.articleStats = stats;
							$log.log(stats[0]);
							stats.forEach(function(stat) {
								if (stat.headline.length>30) {
									stat.headline = stat.headline.substr(0,40)+'...';
								}
							});
						});
				});

			$scope.articleFilter = function(item) {
				return !$scope.currentGameOnly || allGameArticles.indexOf(item.pk)>=0;
			}

			$scope.$watch(function() {return $scope.startDate;}, function() {
				$log.log($scope.startDate.toISOString());
			})
		}
	}
})();