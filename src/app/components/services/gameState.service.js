(function() {
	'use strict';

	angular.module('fact2')
		.service('gameState', gameState);

	/** @ngInject */
	function gameState($log, $http, $q) {
		var service = {
			state: {
				roundNumber: 0,
				articleId: 0,

				totalScore: 0,

				roundInfo: [
					{
						articleIds: [128, 129, 125],
						progressPips: []
					},
					{
						articleIds: [123, 122, 121],
						progressPips: []
					},
					{
						articleIds: [117, 118, 119, 120],
						progressPips: []
					}
				]
			},

			game_record: {},

			beginNewGame: beginNewGame,
			saveGame: saveGame,
			restoreGame: restoreGame
		};

		return service;

		function beginNewGame(userPk) {
			var serviceUrl = '/api/gameplay2/player/'+userPk+'/begin_new_game/';
			return $http.post(serviceUrl)
				.then(function(response) {
					var game_record = response.data;
					$log.log('success beginning new game');
					$log.log(game_record);
					service.game_record = game_record;
					service.state = game_record.game_state;
					service.game_settings = game_record.game_settings;

					var state = service.state;
					state.roundNumber = 0;
					state.articleNumber = 0;
					state.totalScore = 0;

					state.roundInfo = [];

					service.game_settings.roundInfo.forEach(function(info) {
						// make sure there are no backward compatibility issues...
						if (angular.isUndefined(info.shouldRandomize)) {
							info.shouldRandomize = false;
						}
						if (!info.shouldRandomize || angular.isUndefined(info.roundLength)) {
							info.roundLength = info.articleIds.length;
						}
						
						var round = {};

						var articleIds = angular.copy(info.articleIds);
						if (info.shouldRandomize) {
							shuffle(articleIds);
							articleIds = articleIds.slice(0,info.roundLength);
						}

						round.progressPips = [];
						for (var i=0; i<articleIds.length; i++) {
							round.progressPips.push('');
						}
						round.articleIds = articleIds;
						state.roundInfo.push(round);
					});

					service.saveGame();

				});
		}

		function saveGame() {
			var serviceUrl = '/api/gameplay2/game_play/'+service.game_record.pk+'/';
			var gameRecord = service.game_record;
			$log.log("saveGame: "+gameRecord.pk);
			$log.log(gameRecord);

			if (gameRecord.pk) {
				gameRecord.total_score = service.state.totalScore;
				gameRecord.game_state = service.state;

				return $http.post(serviceUrl, gameRecord)
					.then(function(response) {
					}, function(response) {
						$log.log('saveGame failure');
						$log.log(response);
					});
			} else {
				return $q.resolve();
			}

		}

		function restoreGame(gamePk) {
			var serviceUrl = '/api/gameplay2/game_play/'+gamePk+'/';
			return $http.get(serviceUrl)
						.then(function(response) {
							var game_record = response.data;
							service.game_record = game_record;
							service.state = game_record.game_state;
							service.game_settings = game_record.game_settings;
						});
		}

		/* for development use only... */
		function resetGame() {
			var decentArticles = [124, 123, 122, 121, 117, 118, 119, 120, 106, 107, 108, 109, 110, 111, 112, 113, 114, 
									115, 116, 95, 96, 97, 98, 99, 100, 101, 103, 104, 105, 94, 88, 79, 83, 75, 76, 
									70, 71, 67, 56, 41, 44, 2, 3, 4, 9, 10, 15, 28];

			shuffle(decentArticles);
			var roundLength = 10;
			service.roundInfo[0].articleIds = decentArticles.slice(0,roundLength);
			service.roundInfo[1].articleIds = decentArticles.slice(roundLength,2*roundLength);
			service.roundInfo[2].articleIds = decentArticles.slice(2*roundLength,3*roundLength);

			service.roundInfo.forEach(function(info) {
				info.progressPips.splice(0);
				for (var i=0; i<info.articleIds.length; i++) {
					info.progressPips.push('');
				}
			});
		}

	}

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

})();