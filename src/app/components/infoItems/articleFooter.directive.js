(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleFooter', articleFooter);

	/** @ngInject */
	function articleFooter($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/infoItems/articleFooter.html'
		};
	}

})();