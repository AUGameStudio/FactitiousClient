(function() {
	'use strict';

	angular.module('fact2')
		.directive('articlePayoff', articlePayoff);

	/** @ngInject */
	function articlePayoff($log) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				main: '='
			},
			templateUrl: 'app/components/articlePayoff/articlePayoff.html'
		};
	}
})();