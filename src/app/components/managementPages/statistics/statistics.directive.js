(function() {
	'use strict';

	angular.module('fact2')
		.directive('statisticsPage', statisticsPage);

	/** @ngInject */
	function statisticsPage($log, dataTracking, gameSettings) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/managementPages/statistics/statisticsPage.html'
		};

		function controller($scope) {
			var allGameArticles = [];
			$scope.currentGameOnly = true;
			$scope.filterByDate = true;

			$scope.needsUpdate = false;

			$scope.refreshStatistics = refreshStatistics;

			gameSettings.getSettings()
				.then(function() {
					
					allGameArticles = [];
					gameSettings.roundInfo.forEach(function(round) {
						allGameArticles = allGameArticles.concat(round.articleIds);
					});

					$scope.startDate = new Date(gameSettings.modified_date);
					$scope.endDate = new Date();

					refreshStatistics();

				});

			$scope.articleFilter = function(item) {
				return !$scope.currentGameOnly || allGameArticles.indexOf(item.pk)>=0;
			}

			function refreshStatistics() {
				var sd, ed;
				if ($scope.filterByDate) {
					sd = $scope.startDate;
					ed = $scope.endDate;
				}

				dataTracking.getArticleStatistics(sd, ed)
					.then(function(stats) {
						$scope.articleStats = stats;
						$log.log(stats[0]);
						stats.forEach(function(stat) {
							if (stat.headline.length>30) {
								stat.headline = stat.headline.substr(0,40)+'...';
							}
						});
					});

				dataTracking.getGamePlayStatistics(sd, ed)
					.then(function(stats) {
						$scope.gamePlayStats = stats;
						$log.log(stats);
					});

				$scope.needsUpdate = false;
			}

		}
	}
})();