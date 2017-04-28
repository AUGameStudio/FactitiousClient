(function() {
	'use strict';

	angular.module('fact2')
		.directive('manageHome', manageHome);

	/** @ngInject */
	function manageHome($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/managementPages/manageHome/manageHome.html'
		};
	}
})();