(function() {
	'use strict';

	angular.module('fact2')
		.directive('launchPage', launchPage);

	/** @ngInject */
	function launchPage($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/launchPage/launchPage.html',
			replace: true,
			controller: controller
		};

		function controller($scope, audioService) {
			$scope.fullStart = function() {
				audioService.playACSound('btn');
				$scope.main.state = 'startupSequence';
			}
		}
	}
})();
