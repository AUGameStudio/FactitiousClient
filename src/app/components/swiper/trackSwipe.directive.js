(function() {

	'use strict';

	angular.module('fact2')
		.directive('trackSwipe', trackSwipe)
		.directive('debounce', debounce);

	/** @ngInject */
	function trackSwipe($log, $timeout, $window, swiperService, audioService) {

		return {
			restrict: 'A',
			link: link
		};

		function link(scope, elm) {
			var anchorX, dragX;

			var triggerThreshold = 20;
			var swipeThreshold = 100;
			var shouldSwipe = false;

			var canTouch = 'ontouchstart' in $window;

			scope.main.debugStr +=' canTouch '+canTouch;

			if (!canTouch) {
				elm.on('mousedown', trackDown);
			} else {
				elm.on('touchstart', trackDown);
			}

			function trackDown(e) {

				if (scope.main.shouldSwipe || scope.main.state !== 'showArticle') {
					// debounce...
					return;
				}

				audioService.playACSound('silent'); // ARRRGGGGGGHHH! Why is this required for Safari?
				anchorX = getPageX(e);

				elm.on('mousemove', trackMove);
				elm.on('touchmove', trackMove);
				elm.on('mouseleave', trackUp);
				elm.on('mouseup', trackUp);
				elm.on('touchend', trackUp);

				// scope.main.debugStr = "didTrackDownEnd";
			}

			function trackUp(e) {

				if ((scope.main.inSwipeLeft || scope.main.inSwipeRight) && scope.main.shouldSwipe) {
					if (scope.main.inSwipeLeft) {
						scope.main.swipeLeft(dragX);
					} else {
						scope.main.swipeRight(dragX);
					}
				} else {
					elm.find('.article-card').css('transform', '');
					scope.main.inSwipeLeft = scope.main.inSwipeRight = false;
					scope.main.shouldSwipe = shouldSwipe = false;
				}
				releaseListeners();
				scope.$apply();
				// $log.log('got touchend '+e.type);
			}

			function trackMove(e) {
				var dx = getPageX(e) - anchorX;
				scope.main.inSwipeLeft = (dx < -triggerThreshold);
				scope.main.inSwipeRight = (dx > triggerThreshold);
				shouldSwipe = Math.abs(dx)>swipeThreshold;
				scope.main.shouldSwipe = shouldSwipe;
				if (scope.main.inSwipeLeft || scope.main.inSwipeRight) {
					var sgn = (scope.main.inSwipeLeft ? -1 : 1);
					dragX = 0.5*(dx - sgn*triggerThreshold);
					elm.find('.article-card').css('transform', 'translateX('+dragX+'px)');
				} else {
					elm.find('.article-card').css('transform', 'translateX(0px)');
				}
				scope.$apply();
			}

			function releaseListeners() {
				elm.off('mousemove', trackMove);
				elm.off('touchmove', trackMove);
				elm.off('mouseleave', trackUp);
				elm.off('mouseup', trackUp);
				elm.off('touchend', trackUp);
			}

			function getPageX(evt) {
				if (evt.type.indexOf('mouse')>=0) {
					return evt.pageX;
				} else if (evt.changedTouches) {
					return evt.changedTouches[0].pageX;
				} else if (evt.originalEvent.changedTouches) {
					return evt.originalEvent.changedTouches[0].pageX;
				} else {
					return event.changedTouches[0].pageX;
				}
			}

		}
	}

	// this is to fix some angular material bug where buttons end up getting focus after a swipe... grrr!
	/** @ngInject */
	function debounce($log, $timeout) {
		return {
			restrict: 'A',
			link: link
		};

		function link(scope, elm) {
			elm.css({'pointer-events': 'none'});

			$timeout(function() {
				elm.css({'pointer-events': 'initial'});
			}, 200);
		}
	}

})();