(function() {
	'use strict';

	angular.module('fact2')
		.service('gameSettings', gameSettings);

	/** @ngInject */
	function gameSettings($log, $http, authorizationService) {
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
			postSettings: postSettings,
			updateSettingsCalculations: updateSettingsCalculations

		};

		return service;

		function updateSettingsCalculations() {
			// set up so that the gamePlay record will have the appropriate values...
			service.maximum_articles_played = 0;
			service.maximum_score = 0;
			service.roundInfo.forEach(function(round) {
				if (angular.isUndefined(round.shouldRandomize)) {
					round.shouldRandomize = false;
				}
				if (!round.shouldRandomize || angular.isUndefined(round.roundLength)) {
					round.roundLength = round.articleIds.length;
				}
				service.maximum_articles_played += round.roundLength; // round.articleIds.length;
				service.maximum_score += round.roundLength*round.reward; // round.articleIds.length * round.reward;
			});
		}

		function getSettings() {
			return $http.get(serviceUrl)
				.then(function(response) {
					// $log.log('success');
					// $log.log(response);
					var settings = response.data;
					angular.extend(service, settings);
					updateSettingsCalculations();
				});
		}

		function postSettings() {

			var request = {
				method: 'POST',
				url: serviceUrl,
				headers: {
					'Content-type': 'application/json'
				},
				data: service
			};

			authorizationService.setAuthHeader(request.headers);

			updateSettingsCalculations();
			// return $http.post(serviceUrl, service, {headers: headers})
			return $http(request)
				.then(function(response) {
					// $log.log('success');
					// $log.log(response);
					var settings = response.data;
					angular.extend(service, settings);
				});
		}


	}
})();