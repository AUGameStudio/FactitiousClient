(function() {
	'use strict';

	angular.module('fact2')
		.directive('launchPage', launchPage);

	/** @ngInject */
	function launchPage($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/launchPage/launchPage.html',
			replace: true
		};
	}
})();
