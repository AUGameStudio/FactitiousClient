(function() {
	'use strict';

	angular.module('fact2')
		.directive('startupSequence', startupSequence)
		.directive('f2RadioBlock', f2RadioBlock);

	/** @ngInject */
	function startupSequence($log) {
		return {
			restrict: 'E',
			scope: {
				main: '='
			},
			controller: controller,
			templateUrl: 'app/components/startup/startupSequence.html'
		};

		function controller($scope) {
			$scope.userInfo = {
				age: 16,
				gender: '',
				education: '',
				newsMediaSavvy: '',
				username: ''
			};

			$scope.state = "signIn";

			$scope.tryLogin = function() {
				$log.log('try logging in as '+$scope.userInfo.username);
				$scope.state = 'userNotFound';
			}

			$scope.cancelLogin = function() {
				$scope.main.state = 'showLaunch';
			}

			$scope.cancelCreate = function() {
				$scope.state = 'signIn';
			}

			$scope.getUserInfo = function() {
				$scope.state = 'getInfo';
			}

			$scope.cancelGetInfo = function() {
				$scope.state = 'signIn';
			}

			$scope.usernameValid = function() {
				return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.userInfo.username)); 
			}

			$scope.infoValid = function() {
				return $scope.userInfo.gender && $scope.userInfo.education && $scope.userInfo.newsMediaSavvy;
			}


		}
	}

	/** @ngInject */
	function f2RadioBlock($log) {
		return {
			restrict: 'E',
			scope: {
				model: '=',
				value: '@'
			},
			transclude: true,
			template: [
					'<div ng-click="clicked()" class="f2-radio-dot" ng-class="{selected: model==value}"></div>',
					'<div ng-click="clicked()" ng-transclude></div>'
				].join(''),
			controller: controller,
			link: link
		};

		function controller($scope, $element) {
			$scope.clicked = function() {
				$scope.model = $scope.value;
			}
		}

		function link(scope, elm) {

			$(elm).click(function() {
				scope.clicked();
				scope.$apply();
			});
		}
	}
})();