(function() {
	'use strict';

	angular.module('fact2')
		.service('dataTracking', dataTracking);

	/** @ngInject */
	function dataTracking($log, $http, gameState) {
		var startTime = moment();
		var service = {

			startArticle: startArticle,
			endArticle: endArticle,

			getArticleStatistics: getArticleStatistics,
			getGamePlayStatistics: getGamePlayStatistics
		};

		return service;

		function startArticle(articlePk) {
			startTime = moment();
		}

		function endArticle(articlePk, correct, hadHint) {
			var dt = Math.round(moment().diff(startTime)/1000);
			gameState.game_record.total_time_seconds += dt;
			gameState.game_record.total_articles_played += 1;
			if (correct) {
				gameState.game_record.total_articles_correct += 1;
			}
			// $log.log('track article '+articlePk+' '+dt+' '+correct+' '+hadHint);
			// $log.log('game_record t '+gameState.game_record.total_time_seconds+' p '+gameState.game_record.total_articles_played+' c '+gameState.game_record.total_articles_correct);

			var serviceUrl = '/api/gameplay2/track_article/';
			var data = {
				article_pk: articlePk,
				player_pk: 1,
				total_time_seconds: dt,
				was_correct: correct,
				showed_hint: hadHint || false
			};

			return $http.post(serviceUrl, data)
				.then(function(response) {
				});
		}

		function getArticleStatistics(startDate, endDate) {
			var serviceUrl = '/api/gameplay2/get_article_stats/';
			var options;
			if (startDate) {
				options = {
					params: {start_date: startDate}
				};
				if (endDate) {
					options.params.end_date = endDate;
				}
			}

			return $http.get(serviceUrl, options)
				.then(function(response) {
					return response.data;
				});

		}

		function getGamePlayStatistics(startDate, endDate) {
			var serviceUrl = '/api/gameplay2/get_game_play_stats/';

			var options;
			if (startDate) {
				options = {
					params: {start_date: startDate}
				};
				if (endDate) {
					options.params.end_date = endDate;
				}
			}

			return $http.get(serviceUrl, options)
				.then(function(response) {
					var rawStats = response.data;
					var res = [];
					['completed', 'cancelled', 'inPlay', 'abandoned'].forEach(function(key) {
						if (rawStats[key]) {
							rawStats[key].outcome_status = key;
							res.push(rawStats[key]);
						}
					});
					return res;
				});
		}
	}

})();