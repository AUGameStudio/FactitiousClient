(function() {
	'use strict';

	angular.module('fact2')
		.directive('gamePayoff', gamePayoff);

	/** @ngInject */
	function gamePayoff($log, gameState, $window) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/gamePayoff/gamePayoff.html',
			replace: true,
			controller: controller
		};

		function controller($scope) {
			$scope.gameState = gameState;

			var totCorrect = 0, totArticles = 0;
			gameState.state.roundInfo.forEach(function(info) {
				info.progressPips.forEach(function(pip) {
					totArticles += 1;
					if (pip==='win') {
						totCorrect += 1;
					}
				});
			});

			$scope.percentCorrect = Math.round(100*totCorrect/totArticles);

			var gameUrl = $window.location.href.split('#')[0];

			var twitterMessage = {
				text: "I got "+$scope.percentCorrect+"% correct playing the Factitious Game at "+gameUrl+" !",
				original_referer: gameUrl,
				ref_src: "twsrc^tfw",
			};



			var twitterUrl = 'https://twitter.com/intent/tweet';

			$scope.twitterApiURI = constructUri(twitterUrl, twitterMessage);

			$scope.facebookApiURI = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(gameUrl);

			function constructUri(url, obj) {
				var uri = url+'?';
				var queries = [];
				for (var key in obj) {
					queries.push(key+'='+encodeURIComponent(obj[key]));
				}
				return uri+queries.join('&');
			}
		}
	}
})();
