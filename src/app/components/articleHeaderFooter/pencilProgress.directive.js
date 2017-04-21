(function() {
	'use strict';

	angular.module('fact2')
		.directive('pencilProgress', pencilProgress);

	/** @ngInject */
	function pencilProgress($log, gameState) {
		return {
			restrict: 'E',
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				curProgress: '='
			},
			templateUrl: 'app/components/articleHeaderFooter/pencilProgress.html'
		};

		function controller($scope) {
			var vm = this;

			vm.progressIndicator = 0;

			$scope.$watch(function() {return gameState.state.roundInfo[gameState.state.roundNumber];}, function() {
				if (gameState.state.roundNumber<gameState.state.roundInfo.length) {
					vm.progressPips = gameState.state.roundInfo[gameState.state.roundNumber].progressPips;
					vm.progressIndicator = 120*(gameState.state.articleNumber/vm.progressPips.length);
					if (isNaN(vm.progressIndicator)) {
						vm.progressIndicator = 0;
					}
				}
			});

			$scope.$watch(function() {return gameState.state.articleNumber;}, function() {
				if (gameState.state.roundNumber<gameState.state.roundInfo.length) {
					vm.progressPips = gameState.state.roundInfo[gameState.state.roundNumber].progressPips;
					vm.progressIndicator = 120*(gameState.state.articleNumber/vm.progressPips.length)
					if (isNaN(vm.progressIndicator)) {
						vm.progressIndicator = 0;
					}
				}
			});
		}
	}
})();