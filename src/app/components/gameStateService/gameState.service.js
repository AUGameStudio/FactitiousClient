(function() {
	'use strict';

	angular.module('fact2')
		.service('gameState', gameState);

	/** @ngInject */
	function gameState($log) {
		var service = {
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
			],

			resetGame: resetGame

		};

		resetGame();

		return service;

		function resetGame() {
			var decentArticles = [123, 122, 121, 117, 118, 119, 120, 106, 107, 108, 109, 110, 111, 112, 113, 114, 
									115, 116, 95, 96, 97, 98, 99, 100, 101, 103, 104, 105, 94, 88, 79, 83, 75, 76, 
									70, 71, 65, 66, 67, 63, 61, 56, 41, 44, 2, 3, 4, 7, 8, 9, 10, 11, 15, 19, 22, 25, 26, 28, 29, 34];

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