(function() {
	'use strict';

	angular.module('fact2')
		.directive('gameSettingsEditor', gameSettingsEditor);

	/** @ngInject */
	function gameSettingsEditor($log, gameSettings) {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/gameSettings/gameSettingsEditor.html'
		};

		function controller($scope) {
			gameSettings.postSettings()
				.then(function() {
					$log.log('success');
				});
		}
	}
})();