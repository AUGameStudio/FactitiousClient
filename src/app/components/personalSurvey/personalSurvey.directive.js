(function() {
	'use strict';

	angular.module('fact2')
		.directive('personalSurvey', personalSurvey);

	/** @ngInject */
	function personalSurvey($log) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/personalSurvey/personalSurvey.html',
			replace: true
		};
	}
		
})();