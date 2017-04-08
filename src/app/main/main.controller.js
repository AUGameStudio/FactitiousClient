(function() {
	'use strict';

	angular
		.module('fact2')
		.controller('MainController', MainController)
		.directive('scrolly', scrolly)
		.directive('trackSwipe', trackSwipe)
		.directive('debounce', debounce);

	/** @ngInject */
	function MainController($scope, $log, swiperService, audioService, $window, $timeout, articleService, gameState, $stateParams) {
		var vm = this;

		// to fix various iPhone / iPad oddities, try something like...
		/*
		var vh = $('body').outerHeight();
		$('.bigboy').css({'height': (vh+1)+'px'});
		*/
		$log.log('stateParams');
		$log.log($stateParams);
		vm.isPreview = $stateParams.isPreview;

		vm.simClasses = [
			{simClass: 'sim-iPhone5s', label: 'iPhone 5s'},
			{simClass: 'sim-iPhone6', label: 'iPhone 6'},
			{simClass: 'sim-iPhone6sP', label: 'iPhone 6s+'},
			{simClass: 'sim-iPhone6sPChrome', label: 'iPhone 6s+ Chrome'},
			{simClass: 'sim-galaxyS7', label: 'galaxy S7'},
			{simClass: 'sim-pixel7', label: 'Pixel 7.1'},
			{simClass: 'desktop', label: 'Desktop'}
		];
		vm.simClass = vm.simClasses[0].simClass;

		vm.isIphone = /(iPhone)/i.test(navigator.userAgent);
		vm.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
		vm.debugStr = ''+('webkitAudioContext' in $window);

		vm.article = {
			headline: 'This is the headline. This will always be the headline.',
			info: {
				source: 'Op-Ed Article, Albert Camus',
				publisher: 'Bourbaki News',
				references: 'Source: abcnews.com.co\n\nThis is one of the trickiest kinds of fake news. It mimics a real news site, down to the logo. Look carefully at the URL -- this is not ABC news! '
			},
			photo_url: 'assets/images/oldman.png',
			body: 'Electron capture is a decay which happens in many proton-rich, heavy nuclei. You can envision the situation in your title as "forced electron capture".\n\nSquishing atoms together at such high densities makes it energetically favorable for electrons to be destroyed so that the resulting particles can occupy lower energy levels.\n\nThere\'s no need to think about nuclei at the quark level, but you certainly can. The actual matter in neutron stars is in the form of exotic phases of nuclear matter rather than discrete nuclei, but anyway what I said above gives a good heuristic description.\n\nIt\'s not just the electron that turns into a neutrino and neutron, it\'s both the electron and the proton, so there\'s no net change of charge.'
		};
		vm.article.body += '\n\n'+vm.article.body;

		vm.curProgress = 0;
		vm.maxProgress = 10;
		vm.progressPips = [];
		for (var i=0; i<vm.maxProgress; i++) {
			vm.progressPips.push('');
		}

		vm.inSwipe = false;

		vm.swipeLeft = swipeLeft;
		vm.swipeRight = swipeRight;
		vm.showHint = showHint;
		vm.nextQuestion = nextQuestion;
		vm.nextRound = nextRound;
		vm.startOver = startOver;
		vm.toggleBurger = toggleBurger;
		vm.quickStartGame = quickStartGame;
		vm.getSimClass = getSimClass;

		vm.showBurger = false;

		vm.state = 'showArticle';

		vm.mood = 'assets/icons/ic_sentiment_neutral_black_24px.svg';

		gameState.resetGame();

		$scope.$watch(function() {return gameState.roundNumber;}, function() {
			slideInBanner();
		});

		$scope.$watch(function() {return vm.article;}, function() {
			vm.slideInArticle = true;
			$timeout(function() {
				vm.slideInArticle = false;
			}, 750);
		})

		activate();

		function activate() {
			gameState.totalScore = 0;
			gameState.roundNumber = 0;
			gameState.articleNumber = 0;
			vm.numberOfRounds = gameState.roundInfo.length;

			vm.state = 'prepareArticle';
			articleService.getArticle(gameState.roundInfo[gameState.roundNumber].articleIds[gameState.articleNumber])
				.then(function(response) {
					vm.article = response;
					vm.state = 'showLaunch';
				});
		}

		function getSimClass() {
			if (vm.isPreview) {
				return vm.simClass;
			} else {
				return ((vm.isSafari && vm.isIphone) ? 'is-mobile-safari' : '');
			}
		}

		function quickStartGame() {
			vm.state = 'showArticle';
			slideInBanner();
		}

		function swipeLeft(dragX) {
			// if (vm.shouldSwipe) return;
			vm.shouldSwipe = true;
			vm.inSwipeLeft = true;
			vm.inSwipe = true;
			audioService.playACSound('whoosh');
			swiperService.swipeCard($scope, $('.article-card'), 'left', dragX)
				.then(function() {
					$log.log('Main swiped left!')
					vm.shouldSwipe = false;
					scoreSwipe('notNews');
					vm.state = 'showResult';
					vm.inSwipe = false;
				});
		}

		function swipeRight(dragX) {
			// if (vm.shouldSwipe) return;
			vm.shouldSwipe = true;
			vm.inSwipeRight = true;
			vm.inSwipe = true;
			audioService.playACSound('whoosh');
			swiperService.swipeCard($scope, $('.article-card'), 'right', dragX)
				.then(function() {
					$log.log('Main swiped right!')
					vm.shouldSwipe = false;
					scoreSwipe('news');
					vm.state = 'showResult';
					vm.inSwipe = false;
				});
		}

		function showHint() {
			vm.articleExpanded = true;
			$timeout(function() {
				$('.article-card').scrollTop($('.article-card').scrollTop()+50);
			}, 250);
		}

		function scoreSwipe(swipeDir) {
			var roundInfo = gameState.roundInfo[gameState.roundNumber];
			roundInfo.progressPips[gameState.articleNumber] = (swipeDir===vm.article.articleType ? 'win' : 'lose');
			if (roundInfo.progressPips[gameState.articleNumber]==='win') {
				gameState.totalScore += 5;
				vm.mood = 'assets/icons/ic_mood_black_24px.svg';
				vm.payoffType = 'correct';
			} else {
				vm.mood = 'assets/icons/ic_mood_bad_black_24px.svg';
				vm.payoffType = 'incorrect';
			}
		}

		function nextQuestion() {
			var roundInfo = gameState.roundInfo[gameState.roundNumber];
			if (gameState.articleNumber<roundInfo.articleIds.length-1) {
				gameState.articleNumber += 1;
				vm.state = 'prepareArticle';
				articleService.getArticle(roundInfo.articleIds[gameState.articleNumber])
					.then(function(response) {
						vm.article = response;
						vm.state = 'showArticle';
						vm.mood = 'assets/icons/ic_sentiment_neutral_black_24px.svg';
						vm.articleExpanded = false;
					});
			} else {
				vm.state = 'showRoundResult';
			}
		}

		function nextRound() {
			gameState.roundNumber += 1;
			if (gameState.roundNumber>=gameState.roundInfo.length) {
				vm.state = "showGamePayoff";
			} else {
				gameState.articleNumber = 0;
				vm.state = 'prepareArticle';
				articleService.getArticle(gameState.roundInfo[gameState.roundNumber].articleIds[gameState.articleNumber])
					.then(function(response) {
						vm.article = response;
						vm.state = 'showArticle';
						vm.mood = 'assets/icons/ic_sentiment_neutral_black_24px.svg';
						vm.articleExpanded = false;
					});
			}
		}

		function startOver() {
			gameState.resetGame();
			activate();
			vm.state = 'showLaunch';
			vm.showBurger = false;
			slideInBanner();
		}

		function slideInBanner() {
			vm.showRoundBanner = true;
			vm.roundNumber = gameState.roundNumber;
			$timeout(function() {
				vm.showRoundBanner = false;
			}, 2000);
		}

		function toggleBurger() {
			vm.showBurger = !vm.showBurger;
			vm.showInstructions = false;
		}

	}

	/** @ngInject */
	function scrolly($log, $timeout) {
		return {
			restrict: 'A',
			link: link
		};

		function link(scope, elm) {
			var mode = "atBottom";
			var couldExpand = false;
			var refractoryTime = 100;
			var refractoryTimer;

			if (mode=="atTop") {
				$timeout(function() {$(elm).scrollTop(1);}, 100);
				scope.$watch(function() {return scope.main.article.expanded;}, function() {
					if (!scope.main.article.expanded) {
						$(elm).scrollTop(1);
					}
				});
				elm.on('scroll', function(e) {
					if (elm.scrollTop()<=0 && !scope.main.inSwipeLeft && !scope.main.inSwipeRight) {
						scope.main.article.expanded = true;
						scope.$apply();
					}
				});
			} else {

				elm.on('mousewheel', trackScrollStartEnd);
				elm.on('touchmove', trackScrollStartEnd);

				var srcHeight = elm.find('.source-area').innerHeight();
				var scrollMax = elm[0].scrollHeight-elm.innerHeight();

				elm.on('scroll', function(e) {
					// $log.log(e);
					/*
					var srcHeight = elm.find('.source-area').innerHeight();
					var scrollMax = elm[0].scrollHeight-elm.innerHeight();
					if (!scope.main.article.expanded) {
						if (couldExpand) {
							if (elm.scrollTop()>=scrollMax) {
								scope.main.article.expanded = true;
								scope.$apply();
							} else {
								couldExpand = false;
							}
						}
					}
					*/
					$log.log(elm.scrollTop(), scrollMax);
				});
			}

			function trackScrollStartEnd(e) {
				if (scope.main.article.expanded) return;
				if (!refractoryTimer) {
					// startingScroll...
					$log.log('start scroll: '+e.type);
					if (atScrollBottom() && couldExpand) {
						$log.log('expand it!');
						scope.main.article.expanded = true;
						scope.$apply();
						$timeout(function() {
							$(elm.scrollTop(elm.scrollTop()+50));
						}, 250);
						return;
					}
				} else {
					$timeout.cancel(refractoryTimer);
				}
				refractoryTimer = $timeout(onScrollEnd, refractoryTime);
			}

			function onScrollEnd() {
				$log.log('at scroll end');
				couldExpand = atScrollBottom();
				refractoryTimer = null;
			}

			function atScrollBottom() {
				var scrollMax = elm[0].scrollHeight-elm.innerHeight();
				return elm.scrollTop()>= scrollMax;
			}

		}
	}

	/** @ngInject */
	function trackSwipe($log, $timeout, $window, swiperService, audioService) {

		return {
			restrict: 'A',
			link: link
		};

		function link(scope, elm) {
			var anchorX, dragX;

			var triggerThreshold = 20;
			var swipeThreshold = 100;
			var shouldSwipe = false;

			var canTouch = 'ontouchstart' in $window;

			scope.main.debugStr +=' canTouch '+canTouch;

			if (!canTouch) {
				elm.on('mousedown', trackDown);
			} else {
				elm.on('touchstart', trackDown);
			}

			function trackDown(e) {
				if (scope.main.shouldSwipe || scope.main.state !== 'showArticle') {
					// debounce...
					return;
				}
				audioService.playACSound('silent'); // ARRRGGGGGGHHH! Why is this required for Safari?
				anchorX = getPageX(e);

				elm.on('mousemove', trackMove);
				elm.on('touchmove', trackMove);
				elm.on('mouseleave', trackUp);
				elm.on('mouseup', trackUp);
				elm.on('touchend', trackUp);
			}

			function trackUp(e) {
				if ((scope.main.inSwipeLeft || scope.main.inSwipeRight) && scope.main.shouldSwipe) {
					if (scope.main.inSwipeLeft) {
						scope.main.swipeLeft(dragX);
					} else {
						scope.main.swipeRight(dragX);
					}
				} else {
					elm.find('.article-card').css('transform', '');
					scope.main.inSwipeLeft = scope.main.inSwipeRight = false;
					scope.main.shouldSwipe = shouldSwipe = false;
				}
				releaseListeners();
				scope.$apply();
				$log.log('got touchend '+e.type);
			}

			function trackMove(e) {
				var dx = getPageX(e) - anchorX;
				scope.main.inSwipeLeft = (dx < -triggerThreshold);
				scope.main.inSwipeRight = (dx > triggerThreshold);
				shouldSwipe = Math.abs(dx)>swipeThreshold;
				scope.main.shouldSwipe = shouldSwipe;
				if (scope.main.inSwipeLeft || scope.main.inSwipeRight) {
					var sgn = (scope.main.inSwipeLeft ? -1 : 1);
					dragX = 0.5*(dx - sgn*triggerThreshold);
					elm.find('.article-card').css('transform', 'translateX('+dragX+'px)');
				} else {
					elm.find('.article-card').css('transform', 'translateX(0px)');
				}
				scope.$apply();
			}

			function releaseListeners() {
				elm.off('mousemove', trackMove);
				elm.off('touchmove', trackMove);
				elm.off('mouseleave', trackUp);
				elm.off('mouseup', trackUp);
				elm.off('touchend', trackUp);
			}

			function getPageX(evt) {
				if (evt.type.indexOf('mouse')>=0) {
					return evt.pageX;
				} else {
					return event.changedTouches[0].pageX;
				}
			}

		}
	}

	/** @ngInject */
	function debounce($log, $timeout) {
		return {
			restrict: 'A',
			link: link
		};

		function link(scope, elm) {
			elm.css({'pointer-events': 'none'});

			$timeout(function() {
				elm.css({'pointer-events': 'initial'});
			}, 200);
		}
	}
})();
