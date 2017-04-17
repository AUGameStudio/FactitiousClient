(function() {
	'use strict';

	angular.module('fact2')
		.service('dataTracking', dataTracking);

	/** @ngInject */
	function dataTracking($log, $http, gameState) {
		var startTime = moment();
		var service = {

			startArticle: startArticle,
			endArticle: endArticle
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
			$log.log('track article '+articlePk+' '+dt+' '+correct+' '+hadHint);
			$log.log('game_record t '+gameState.game_record.total_time_seconds+' p '+gameState.game_record.total_articles_played+' c '+gameState.game_record.total_articles_correct);

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
					$log.log('success');
					$log.log(response);
				});
		}
	}

})();