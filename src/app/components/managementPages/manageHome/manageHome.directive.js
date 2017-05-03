(function() {
	'use strict';

	angular.module('fact2')
		.directive('manageHome', manageHome);

	/** @ngInject */
	function manageHome($log, $state, authorizationService) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/managementPages/manageHome/manageHome.html',
			controller: controller
		};

		function controller($scope) {
			if (!authorizationService.verifyAuthorized()) {
				$state.go('manageLogin');
				return;
			}
		}
	}
})();