(function() {
	'use strict';

	angular.module('fact2')
		.directive('loginPage', loginPage);

	/** @ngInject */
	function loginPage($log, $state, authorizationService) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/managementPages/login/login.html'
		};

		function controller($scope) {
			$scope.tryToLogin = tryToLogin;

			authorizationService.signOut();

			$scope.$watch(function() {return $scope.username+'|'+$scope.password; }, function() {
				// $log.log($scope.username+'|'+$scope.password);
			});

			function tryToLogin() {
				authorizationService.authorize($scope.username, $scope.password)
					.then(function(outcome) {
						$log.log('outcome: '+outcome);
						$scope.hadLoginError = !outcome;

						if (outcome) {
							$state.go('manageHome');
						}
					});
			}
		}
	}
})();