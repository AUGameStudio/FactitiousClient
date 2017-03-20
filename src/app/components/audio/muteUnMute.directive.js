
(function() {
	'use strict';

	angular.module('fact2')
		.directive('muteUnmute', muteUnmute);

	function muteUnmute($log, audioService) {
		return {
			restrict: 'E',
			controller: controller,
			scope: {

			},
			template: [
					'<div ng-click="toggleAudio()">',
						'<i ng-if="audioService.muted" class="material-icons mute-unmute">volume_off</i>',
						'<i ng-if="!audioService.muted" class="material-icons mute-unmute">volume_up</i>',
					'</div>'
				].join('')
		};

		function controller($scope) {
			$scope.audioService = audioService;

			$scope.toggleAudio = function() {
				if (audioService.muted) {
					audioService.unmuteAll();
				} else {
					audioService.muteAll();
				}
			}
		}
	}
})();
