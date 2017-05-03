(function() {
	'use strict';

	angular.module('fact2')
		.directive('statisticsPage', statisticsPage);

	/** @ngInject */
	function statisticsPage($log, dataTracking, gameSettings, $document, $window, filesaver, $state, authorizationService) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/managementPages/statistics/statisticsPage.html'
		};

		function controller($scope) {
			if (!authorizationService.verifyAuthorized()) {
				$state.go('manageLogin');
				return;
			}

			var allGameArticles = [];
			$scope.currentGameOnly = true;
			$scope.filterByDate = true;

			$scope.needsUpdate = false;

			$scope.refreshStatistics = refreshStatistics;
			$scope.saveGamesCsv = saveGamesCsv;
			$scope.saveArticlesCsv = saveArticlesCsv;
			$scope.downloadCsv = downloadCsv;
			$scope.downloadDatabase = downloadDatabase;

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

			function downloadCsv(urlFrag) {
				var url = '/api/gameplay2/'+urlFrag+'/?start_date='+$scope.startDate.toISOString()+'&end_date='+$scope.endDate.toISOString();
				$window.location = url;
			}

			function downloadDatabase() {
				var url = '/api/gameplay2/download_database/';
				$window.location = url;
			}

			function saveCSV(csvText, csvName) {
				var blob = new Blob([csvText], {type: "text/plain;charset=utf-8"});
				filesaver.saveAs(blob, csvName);
			}

			function saveGamesCsv() {
				var stats = $scope.gamePlayStats;
				var csvRows = [['outcome', 'num_plays', 'avg_time', 'avg_score', 'avg_score_pct', 'avg_correct', 'avg_correct_pct', 'avg_played', 'avg_played_pct'].join('\t')]
				stats.forEach(function(row) { 
					csvRows.push(
						[	row.outcome_status, row.num_plays, row.avg_time,row.avg_score,row.avg_pct_score*100,row.avg_correct,row.avg_pct_correct*100,
							row.avg_completed, row.avg_pct_completed*100].join('\t')
						);
				});
				saveCSV(csvRows.join('\n'), 'gamePlayAgg.csv');
			}

			function saveArticlesCsv() {
				var stats = $scope.articleStats;
				var csvRows = [['id', 'headline', 'num_plays', 'avg_time', 'num_correct', 'num_hints'].join('\t')]
				stats.forEach(function(row) { 
					if ($scope.articleFilter(row)) {
						csvRows.push(
								[
									row.article_id, '"'+row.headline+'"', row.num_plays, row.avg_time, row.num_correct, row.num_hints
								].join('\t')
							);
					}
				});
				saveCSV(csvRows.join('\n'), 'articlePlayAgg.csv');
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
						stats.forEach(function(stat) {
							if (stat.headline.length>30) {
								stat.headline = stat.headline.substr(0,40)+'...';
							}
						});
					});

				dataTracking.getGamePlayStatistics(sd, ed)
					.then(function(stats) {
						$scope.gamePlayStats = stats;
					});

				$scope.needsUpdate = false;
			}

		}
	}
})();