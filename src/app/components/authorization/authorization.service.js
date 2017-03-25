(function() {
	'use strict';

	angular.module('fact2')
		.service('authorizationService', authorizationService);

	/** @ngInject */
	function authorizationService($log, $http) {
		var authToken;

		var service =  {
			authorize: authorize,
			isAuthorized: false
		};

		return service;

		function authorize(username, password) {
			var authUrl = '/api/f2auth/api-token-auth/';
			authToken = '';
			service.isAuthorized = false;

			return $http.post(authUrl, {username: username, password: password})
				.then(function(response) {
					$log.log('it succeded');
					$log.log(response);
					authToken = response.data.token;
					service.isAuthorized = true;
					$log.log(authToken);
				},
				function(response) {
					$log.log('it failed');
					$log.log(response);
				});
		}
	}
})();