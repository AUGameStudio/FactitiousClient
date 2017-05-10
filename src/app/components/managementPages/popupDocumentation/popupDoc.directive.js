(function () {
	'use strict';

	angular.module('fact2')
		.directive('popupDoc', popupDoc);

	/** @ngInject */
	function popupDoc($log, $timeout) {
		return {
			restrict: 'E',
			link: link
		};

		function link(scope, elm) {
			var delayTimer;
			var delayAffordance = 500;

			elm.on('mouseover', function() {
				$timeout.cancel(delayTimer);
				delayTimer = $timeout(function() {
					elm.addClass('show-popup');
				}, delayAffordance);
			});

			elm.on('mouseout', function() {
				$timeout.cancel(delayTimer);
				delayTimer = $timeout(function() {
					elm.removeClass('show-popup');
				}, delayAffordance);
			});

			scope.$on('$destroy', function() {
				$timeout.cancel(delayTimer);
			});
		}
	}
})();