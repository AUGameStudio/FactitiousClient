(function() {
	'use strict';

	angular.module('fact2')
		.directive('gameSettingsEditor', gameSettingsEditor)
		.filter('utcStrToLocalDate', utcStrToLocalDate);

	/** @ngInject */
	function gameSettingsEditor($log, gameSettings, articleService) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/managementPages/gameSettings/gameSettingsEditor.html'
		};

		function controller($scope) {
			var cleanSettings;
			$scope.articleDict = {}

			$scope.revertSettings = revertSettings;
			$scope.saveSettings = saveSettings;

			articleService.getArticleList()
				.then(function(articleList) {
					articleList.forEach(function(a) {
						$scope.articleDict[a.pk] = a;
					});
				});

			gameSettings.getSettings()
				.then(function() {
					$scope.gameSettings = gameSettings;
					cleanSettings = angular.copy(gameSettings);
					$scope.$watch(function() {return angular.toJson(gameSettings);}, function() {
						gameSettings.updateSettingsCalculations();
						$scope.settingsHaveChanged = !angular.equals(cleanSettings, $scope.gameSettings);
					});
				});

			function revertSettings() {
				gameSettings.getSettings()
					.then(function() {
						cleanSettings = angular.copy(gameSettings);
						$scope.settingsHaveChanged = false;
					});
			}

			function saveSettings() {
				gameSettings.postSettings()
					.then(function() {
						cleanSettings = angular.copy(gameSettings);
						$scope.settingsHaveChanged = false;
					});
			}

		}
	}

	/** @ngInject */
	function utcStrToLocalDate() {
		return function(str) {
			var d = moment(str);
			return d.format('h:mm a ddd MMM DD YYYY');
		};
	}
})();