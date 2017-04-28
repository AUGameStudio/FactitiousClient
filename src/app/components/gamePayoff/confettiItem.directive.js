(function() {
	'use strict';

	angular.module('fact2')
		.directive('confettiItem', confettiItem)

	/** @ngInject */
	function confettiItem($log, $interval) {
		return {
			restrict: 'E',
			controller: controller,
			link: link,
			scope: {

			},
			template: '<div class="confetti-item-rotate" ng-class="speedClass"><img ng-src="assets/confetti-particles/{{confID}}.svg"/></div>'
			// template: '<img ng-src="assets/images/angular.png"/>'
		};

		function controller($scope) {
			$scope.confID = Math.floor(Math.random()*7)+1;

			$scope.speedClass = ['rotate-fast', 'normal', 'rotate-slow', 'rotate-slowest'][Math.floor(Math.random()*3)];
			if (Math.random()>0.5) {
				$scope.speedClass += ' counter-rotate';
			}
		}

		function link(scope, elm) {
			var intervalRate = 1000/60;

			elm.css({'left': angular.element('.bigboy').width()*Math.random()-elm.width()});
			// elm.css({'left': (Math.random()*100)+'%'});
			var top = -15 - Math.random()*70;
			elm.css({'top': top+'%'});

		}
	}

})();
