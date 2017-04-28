(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleDisplay', articleDisplay);

	/** @ngInject */
	function articleDisplay($log, $timeout) {
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
			link: link
		};

		function controller($scope) {
			var vm = this;
			$scope.main = vm.main;
		}

		function link(scope, elm, attrs, ctlr) {
			/* for debugging some layout issues... */
			$timeout(function() {
				var w = elm.outerWidth();
				var h = elm.outerHeight();

				ctlr.w = w;
				ctlr.h = h+128;
			}, 1000);
		}
	}
})();