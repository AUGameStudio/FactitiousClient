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
					articleIds: [128, 129, 125, 123, 122, 121, 117, 118, 119, 120],
					progressPips: []
				},
				{
					articleIds: [128, 129, 125, 123, 122, 121, 117, 118, 119, 120],
					progressPips: []
				}
			],

			resetGame: resetGame

		};

		resetGame();

		return service;

		function resetGame() { 
			service.roundInfo.forEach(function(info) {
				info.progressPips.splice(0);
				for (var i=0; i<info.articleIds.length; i++) {
					info.progressPips.push('');
				}
			});
		}

	}
})();