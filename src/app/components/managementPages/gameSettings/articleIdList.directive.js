(function() {
	'use strict';

	angular.module('fact2')
		.directive('articleIdList', articleIdList);

	/** @ngInject */
	function articleIdList($log) {
		return {
			restrict: 'E',
			scope: {
				model: '=',
				valid: '='
			},
			controller: controller,
			controllerAs: 'vm',
			bindToController: true,
			template: '<label>Article Id List </label><input type="text" ng-model="vm.listAsString" ng-change="vm.onChange()" ng-blur="vm.onBlur()">'
		};

		function controller($scope) {
			var vm = this;

			vm.listAsString = vm.model.join(', ');

			vm.onChange = onChange;
			vm.onBlur = onBlur;

			function onChange() {
				$log.log('changed: '+vm.listAsString);
				var provisional = vm.listAsString.split(/\D+/).map(function(item) {return 1*item.trim()}).filter(function(item) {return item>0});
				$log.log(provisional);
				vm.model = provisional;
			}

			function onBlur() {
				$log.log('blur');
				vm.listAsString = vm.model.join(', ');
			}
		}

	}
})();