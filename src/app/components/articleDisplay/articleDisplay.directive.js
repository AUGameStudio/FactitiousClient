(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleDisplay', articleDisplay);

	/** @ngInject */
	function articleDisplay($log) {
		return {
			restrict: 'E',
			scope: {
				articleInfo: '=',
				main: '='
			},
			controller: controller,
			controllerAs: 'ad',
			bindToController: true,
			templateUrl: 'app/components/articleDisplay/articleDisplay.template.html',
			replace: true
		};

		function controller($scope) {
			var vm = this;
		}
	}
})();