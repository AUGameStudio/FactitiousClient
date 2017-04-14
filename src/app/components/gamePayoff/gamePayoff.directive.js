(function() {
	'use strict';

	angular.module('fact2')
		.directive('gamePayoff', gamePayoff);

	/** @ngInject */
	function gamePayoff($log, gameState) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/gamePayoff/gamePayoff.html',
			replace: true,
			controller: controller
		};

		function controller($scope) {
			$scope.gameState = gameState;

			var totCorrect = 0, totArticles = 0;
			gameState.state.roundInfo.forEach(function(info) {
				info.progressPips.forEach(function(pip) {
					totArticles += 1;
					if (pip==='win') {
						totCorrect += 1;
					}
				});
			});

			$scope.percentCorrect = Math.round(100*totCorrect/totArticles);
		}
	}
})();
