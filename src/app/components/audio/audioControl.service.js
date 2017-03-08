(function() {
	'use strict';

	angular.module('proto')
		.service('audioService', audioService);

	/** @ngInject */
	function audioService($log, $window, $cookies, $interval) {
		var soundEffect;

		$log.log('getting... "'+$cookies.get('muted')+'" '+($cookies.get('muted')==='true'));

		var service = {

			muted: ($cookies.get('muted')==='true'),

			audioPath: 'assets/audio/',

			stopSoundEffect: function() {
				if (soundEffect) {
					soundEffect.pause();
					soundEffect = null;
				}
			},

			playSoundEffect: function(fname) {
				if (service.muted) {
					return;
				}
				service.stopSoundEffect();
				var url = service.audioPath+fname;
				$log.log("play soundEffect: "+url);
				soundEffect = new $window.Audio();
				soundEffect.src = url;
				soundEffect.play();
			},


			muteAll: function() {
				service.stopSoundEffect();
				service.muted = true;
				$cookies.put('muted', true);
			},

			unmuteAll: function() {
				service.muted = false;
				$cookies.put('muted', false);
			}
		};

		return service;
	}
})();