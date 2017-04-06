(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleFooter', articleFooter);

	/** @ngInject */
	function articleFooter($log, gameState) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/articleHeaderFooter/articleFooter.html',
			controller: controller
		};

		function controller($scope) {
			$scope.gameState = gameState;
		}
	}

})();