/*

See Apple Doc at:

https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html#//apple_ref/doc/uid/TP40009523-CH6-SW1

*/

(function() {
	'use strict';

	angular.module('fact2')
		.service('audioService', audioService);

	/** @ngInject */
	function audioService($log, $window, $cookies, $interval, $http) {
		var soundEffect;

		$log.log('getting... "'+$cookies.get('muted')+'" '+($cookies.get('muted')==='true'));

		var audioContext = new ($window.AudioContext || $window.webkitAudioContext)();

		var audioPath = 'assets/audio/';

		var soundBuffers = {};

		loadSound('silent', 'silent.mp3');
		loadSound('whoosh', 'whoosh.mp3');

		var service = {

			muted: ($cookies.get('muted')==='true'),

			audioPath: audioPath,

			playACSound: function(soundName) {
				if (service.muted) {
					return;
				}
				var source = audioContext.createBufferSource();
		        source.buffer = soundBuffers[soundName];
		        source.connect(audioContext.destination);
								
		        // Play the sound
		        source.start(0);
   			},

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

		function loadSound(soundName, soundPath) {
			soundPath = soundPath || soundName;

			$http.get(audioPath+soundPath, {responseType:'arraybuffer'})
				.then(function(response) {
					// soundBuffers['moreSlideIn_whoosh.m4a'] = wkAudioContext.createBuffer(response.data, false);

					audioContext.decodeAudioData(response.data, function(buffer) {
	        			soundBuffers[soundName] = buffer;
	        		});
	        	});

		}
	}
})();