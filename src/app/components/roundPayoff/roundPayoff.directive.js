(function() {
	'use strict';

	angular.module('fact2')
		.directive('roundPayoff', roundPayoff);

	/** @ngInject */
	function roundPayoff($log, gameState) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/roundPayoff/roundPayoff.html',
			controller: controller,
			replace: true
		};

		function controller($scope) {
			$scope.gameState = gameState;
			var roundInfo = gameState.state.roundInfo[gameState.state.roundNumber];
			var numCorrect = 0;
			roundInfo.progressPips.forEach(function(pip) {
				if (pip==='win') {
					numCorrect += 1;
				}
			});

			$scope.percentCorrect = Math.round(100*numCorrect/roundInfo.progressPips.length);
		}
	}
	
})();