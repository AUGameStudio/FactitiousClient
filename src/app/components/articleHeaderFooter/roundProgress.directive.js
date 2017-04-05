(function() {
	'use strict';

	angular.module('fact2')
		.directive('roundProgress', roundProgress);

	/** @ngInject */
	function roundProgress($log) {
		return {
			restrict: 'E',
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				progressPips: '=',
				curProgress: '='
			},
			template: [
				'<div class="progress-holder">',
					'<div ng-repeat="pip in vm.progressPips track by $index" class="progress-pip"',
					' ng-class="{\'correct\': pip===\'win\', \'incorrect\': pip===\'lose\', \'current\': vm.curProgress==$index}"></div>',
				'</div>'
				].join('')
		};

		function controller($scope) {
			var vm = this;
			$log.log($scope);

		}
	}
})();