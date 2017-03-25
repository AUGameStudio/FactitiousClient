(function() {
	'use strict';

	angular.module('fact2')
		.directive('articlePayoff', articlePayoff)
		.filter('addHttp', addHttp);

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

	/** @ngInject */
	function addHttp() {
		return function(url) {
			if (url.indexOf('http')!==0) {
				url = 'http://'+url;
			}
			return url;
		}
	}
})();