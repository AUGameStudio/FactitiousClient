(function() {
	'use strict';

	angular.module('fact2')
		.directive('instructPanel', instructPanel);

	/** @ngInject */
	function instructPanel($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/instructPanel/instructPanel.html',
			controller: controller
		};

		function controller($scope) {
			$log.log('Hello!');
		}
	}
})();