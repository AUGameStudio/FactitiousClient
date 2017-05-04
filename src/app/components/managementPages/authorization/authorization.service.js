(function() {
	'use strict';

	angular.module('fact2')
		.service('authorizationService', authorizationService);

	var authCookie = "authToken";

	/** @ngInject */
	function authorizationService($log, $http, $cookies) {
		var authToken;
		var cookieTTL = 4.0/24.0;	// 4 hours

		var service =  {
			authorize: authorize,
			signOut: signOut,
			verifyAuthorized: verifyAuthorized,
			setAuthHeader: setAuthHeader,

			isAuthorized: false
		};

		verifyAuthorized();

		return service;

		function verifyAuthorized() {
			authToken = $cookies.get(authCookie);
			service.isAuthorized = angular.isDefined(authToken) && authToken!=='';
			if (service.isAuthorized) {
				var expireTime = new Date();
				expireTime.setDate(expireTime.getDate()+cookieTTL);
				// $log.log('expires '+expireTime);	
				$cookies.put(authCookie, authToken, {expires: expireTime});
			}
			return service.isAuthorized;
		}

		function authorize(username, password) {
			var authUrl = '/api/f2auth/api-token-auth/';

			signOut();

			return $http.post(authUrl, {username: username, password: password})
				.then(function(response) {
					authToken = response.data.token;
					service.isAuthorized = true;
					var expireTime = new Date();
					expireTime.setDate(expireTime.getDate()+cookieTTL);
					$log.log('expires '+expireTime);	
					$cookies.put(authCookie, authToken, {expires: expireTime});
					return true;
				},
				function(response) {
					$log.log('it failed');
					$log.log(response);
					return false;
				});
		}

		function setAuthHeader(headers) {
			headers = headers || {};
			if (authToken) {
				headers['Authorization'] = 'Token '+authToken;
			}
			return headers;
		}

		function signOut() {
			authToken = '';
			service.isAuthorized = false;
			$cookies.remove(authCookie);
		}
	}
})();