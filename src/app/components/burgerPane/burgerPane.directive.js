(function() {
	'use strict';

	angular.module('fact2')
		.directive('burgerPane', burgerPane);

	/** @ngInject */
	function burgerPane($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/burgerPane/burgerPane.html'
		};
	}

})();