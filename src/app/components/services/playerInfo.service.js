(function() {
	'use strict';

	angular.module('fact2')
		.service('playerService', playerService);

	/** @ngInject */
	function playerService($log, $http, $q, $cookies) {
		var serviceUrl = '/api/gameplay2/player/';
		var service = {
			username: '',
			isAnonymous: true,
			isSignedIn: false,

			playerInfo: {},

			refreshPlayerInfo: refreshPlayerInfo,
			signOut: signOut,
			trySignIn: trySignIn,
			createNewPlayer: createNewPlayer,

			canResume: canResume

		};

		return service;

		function canResume() {
			return !service.isAnonymous 
						&& service.playerInfo.current_game 
						&& !service.playerInfo.current_game.is_completed && !service.playerInfo.current_game.was_cancelled
						&& !(service.playerInfo.current_game.game_state.roundNumber==0 && service.playerInfo.current_game.game_state.articleNumber==0);
		}

		function refreshPlayerInfo() {

			function createAnonPlayer() {
				var anonName = 'anon'+(Math.random()+'').replace('.', '');
				service.playerInfo = {
					username: anonName,
					is_anonymous: true
				};

				$log.log('try to create: '+anonName);
				return $http.post(serviceUrl, service.playerInfo)
					.then(function(response) {
						$log.log('success creating anon-user:'+anonName);
						service.playerInfo = response.data;
						service.isAnonymous = true;
						service.isSignedIn = true;
						$cookies.put('anonUsername', anonName);
						return true;
					});
			}

			var fact2Username = $cookies.get('fact2Username');

			if (fact2Username) {
				return trySignIn(fact2Username);
			} else {
				var anonName = $cookies.get('anonUsername');
				if (!anonName) {
					/*
					anonName = 'anon'+(Math.random()+'').replace('.', '');
					service.playerInfo = {
						username: anonName,
						is_anonymous: true
					};

					$log.log('try to create: '+anonName);
					return $http.post(serviceUrl, service.playerInfo)
						.then(function(response) {
							$log.log('success creating anon-user:'+anonName);
							service.playerInfo = response.data;
							service.isAnonymous = true;
							service.isSignedIn = true;
							$cookies.put('anonUsername', anonName);
							return true;
						});
					*/
					return createAnonPlayer();
				} else {
					$log.log('try to get playerInfo for: '+anonName);
					return $http.get(serviceUrl, {params:{username: anonName}})
						.then(function(response) {
							$log.log('success for user:'+anonName);
							service.playerInfo = response.data;
							service.isAnonymous = true;
							service.isSignedIn = true;
							return true;
						},
						function(response) {
							$log.log('failure for existing user:'+anonName+'; probably you have bad cookie state in development...');
							return createAnonPlayer();
						});
				}
			}
		}

		function signOut() {
			$cookies.remove('fact2Username');	
			service.username = '';
			service.isSignedIn = false;
			service.isAnonymous = true;
		}

		function trySignIn(username) {
			username = username.toLowerCase();
			$log.log('try to get playerInfo for: '+username);
			return $http.get(serviceUrl, {params:{username: username}})
					.then(function(response) {
						$log.log('success for user:'+username);
						service.playerInfo = response.data;
						service.isAnonymous = false;
						service.isSignedIn = true;
						$cookies.put('fact2Username', username);
						return true;
					}, function(response) {
						$log.log('can\'t find '+username);
						return false;
					});
		}

		function createNewPlayer(playerInfo) {
			playerInfo.username = playerInfo.username.toLowerCase();
			$log.log('try to create: '+playerInfo.username);
			return $http.post(serviceUrl, playerInfo)
				.then(function(response) {
					$log.log('success creating :'+playerInfo.username);
					service.playerInfo = response.data;
					service.isSignedIn = true;
					if (service.playerInfo.is_anonymous) {
						$cookies.put('anonUsername', service.playerInfo.username);
					} else {
						$cookies.put('fact2Username', service.playerInfo.username);
					}
					return true;
				});
		}
	}
})();