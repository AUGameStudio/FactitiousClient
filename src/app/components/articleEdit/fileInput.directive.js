(function() {
	'use strict';

	angular.module('fact2')
		.directive('loadImageFile', loadImageFile);

	/** @ngInject */
	function loadImageFile($log) {
		return {
			restrict: 'A',
			scope: {
				loadImageFile: '&'
			},
			link: link
		};

		function link(scope, elm, attrs) {
			$log.log(scope);

			elm.on('click', function() {
				$(elm)[0].value = null; // so that we get a change event...
			});

			elm.on('change', function(e) {

				if (e.target.files && e.target.files.length==1) {
					$log.log('try to upload...');
					scope.loadImageFile({'fileObject':e.target.files[0]});
				}

				scope.$apply();
				
			});
		}
	}
})();