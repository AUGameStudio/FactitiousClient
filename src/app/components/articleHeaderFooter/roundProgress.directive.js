(function() {
	'use strict';

	angular.module('fact2')
		.directive('roundProgress', roundProgress);

	/** @ngInject */
	function roundProgress($log, gameState) {
		return {
			restrict: 'E',
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				// progressPips: '=',
				curProgress: '='
			},
			template: [
				'<div class="progress-holder">',
					'<div ng-repeat="pip in vm.progressPips track by $index" class="progress-pip"',
					' ng-class="{\'correct\': pip===\'win\', \'incorrect\': pip===\'lose\', \'current\': gameState.state.articleNumber==$index}"></div>',
				'</div>'
				].join('')
		};

		function controller($scope) {
			var vm = this;
			$scope.gameState = gameState;

			$scope.$watch(function() {return gameState.state.roundInfo[gameState.state.roundNumber];}, function() {
				if (gameState.state.roundNumber<gameState.state.roundInfo.length) {
					vm.progressPips = gameState.state.roundInfo[gameState.state.roundNumber].progressPips;
				}
			});
		}
	}
})();