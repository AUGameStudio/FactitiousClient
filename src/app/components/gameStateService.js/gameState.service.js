(function() {
	'use strict';

	angular.module('factitious')
		.service('gameState', gameState);

	/** @ngInject */
	function gameState($log) {
		var service = {
			roundNumber: 0,
			articleNumber: 0,

			totalScore: 0,

			articleInfo: {},

			gameInfo: {},



		};

		return service;
		
	}
})