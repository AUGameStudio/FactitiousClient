(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleHeader', articleHeader);

	/** @ngInject */
	function articleHeader($log) {
		return {
			restrict: 'E',
			scope: {
				main: '='
			},
			templateUrl: 'app/components/infoItems/articleHeader.html'
		};
	}
})();