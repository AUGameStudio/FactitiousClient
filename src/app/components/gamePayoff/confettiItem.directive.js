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

			/*
			return;

			var imElm = elm.find('img');

			var animTimer = $interval(animateIt, intervalRate);
			var stillAlive = true;

			scope.$on('$destroy', killAnimation);

			var rotVal = Math.random()*360;
			var rotSpeed = (intervalRate/1000)*(300+Math.random()*120);
			imElm.css({'transform': 'rotate('+rotVal+'deg)'});

			var fallSpeed = (intervalRate/1000)*(350+Math.random()*75);

			var numFalls = 0;

			// animateIt();

			function animateIt() {
				rotVal += rotSpeed;
				top += fallSpeed;
				if (top>parentElm.outerHeight()) {
					if (++numFalls>0) {
						killAnimation();
						return;
						// requestAnimationFrame(animateIt);
					}
					top = -70;
					scope.confID = Math.floor(Math.random()*7)+1;
				}
				elm.css({
					// 'transform': 'translateY('+top+'px)'
				 });
				imElm.css({'transform': 'translateY('+top+'px) rotate('+rotVal+'deg)'});
				// elm.css({'top': top+'px'});
			}

			function killAnimation() {
				$log.log('kill');
				stillAlive = false;
				$interval.cancel(animTimer);
			}
			*/

		}
	}

})();
