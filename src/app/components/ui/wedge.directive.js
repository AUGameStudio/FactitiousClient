(function() {
	'use strict';

	angular.module('fact2')
		.directive('wedge', wedge);

	/** @ngInject */
	function wedge() {
		return {
			restrict: 'E',
			template: [
				  		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"',
				    			'preserveAspectRatio="none" viewBox="0 0 1000 1000">',
				    		'<polygon points="0,0 1000,1000, 0,1000, 0,0"></polygon>',
				  		'</svg>'
				].join('\n')
		};
	}

})();
