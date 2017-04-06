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
			var main = $scope.main;
			$scope.gameState = gameState;
			$scope.disableButtons = function() {
				return (main.state!='showArticle' || main.inSwipe || main.slideInArticle || main.showRoundBanner);
			};
		}
	}

})();