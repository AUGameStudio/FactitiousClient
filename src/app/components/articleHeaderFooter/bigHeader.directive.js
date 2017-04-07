(function() {
	'use strict';

	angular.module('fact2')
		.directive('bigHeader', bigHeader);

	/** @ngInject */
	function bigHeader($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/articleHeaderFooter/bigHeader.html'
		};
	}
})();