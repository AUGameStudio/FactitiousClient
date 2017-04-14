(function() {
	'use strict';

	angular.module('fact2')
		.service('gameSettings', gameSettings);

	/** @ngInject */
	function gameSettings($log, $http) {
		var serviceUrl = "/api/gameplay2/game_settings/";

		var service = {

			roundInfo:[
				{
					articleIds: [128, 129, 125],
					reward: 10,
					reward_with_hint: 5
				},
				{
					articleIds: [123, 122, 121],
					reward: 10,
					reward_with_hint: 5
				},
				{
					articleIds: [117, 118, 119, 120],
					reward: 10,
					reward_with_hint: 5
				}
			],

			getSettings: getSettings,
			postSettings: postSettings

		};

		return service;

		function updateSettingsCalculations() {
			// set up so that the gamePlay record will have the appropriate values...
			service.maximum_articles_played = 0;
			service.maximum_score = 0;
			service.roundInfo.forEach(function(round) {
				service.maximum_articles_played += round.articleIds.length;
				service.maximum_score += round.articleIds.length * round.reward;
			});

		}

		function getSettings() {
			return $http.get(serviceUrl)
				.then(function(response) {
					$log.log('success');
					$log.log(response);
				});
		}

		function postSettings() {
			updateSettingsCalculations();
			return $http.post(serviceUrl, service)
				.then(function(response) {
					$log.log('success');
					$log.log(response);
				});
		}


	}
})();