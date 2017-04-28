(function() {
	'use strict';

	angular.module('fact2')
		.service('swiperService', swiperService);

	/** @ngInject */
	function swiperService($log, $q, $timeout, audioService) {
		var service = {
			swipeCard: swipeCard
		};

		return service;

		function swipeCard(scope, elm, direction, dragX) {
			$log.log('swipeCard start');
			dragX = dragX || 0;
			var deferred = $q.defer();
			var sgn = (direction==='left' ? -1 : 1);

			elm.css('myprop', '0');

			$(elm).animate({
				myprop: 1
			}, {
				step: function(now, tween){
					elm.css('transform', 'translateX('+(dragX+sgn*now*600)+'px)')
				},
				complete: function() {
					$log.log('swipeCard ended')
					$timeout(function() {
						elm.css('transform', '');
					}, 100);
					scope.main.inSwipeLeft = scope.main.inSwipeRight = scope.main.article.expanded = false;
					scope.main.shouldSwipe = false;
					$(elm).scrollTop(1);
					deferred.resolve();
					// scope.$apply();
				}
			}, 500);

			// audioService.playSoundEffect('moreSlideIn_whoosh.m4a');


			return deferred.promise;

		}
	}
})();