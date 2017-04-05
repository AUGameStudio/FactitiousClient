(function() {
	'use strict';

	angular
		.module('fact2')
		.controller('MainController', MainController)
		.directive('scrolly', scrolly)
		.directive('trackSwipe', trackSwipe)
		.directive('debounce', debounce);

	/** @ngInject */
	function MainController($scope, $log, swiperService, audioService, $window, $timeout, articleService) {
		var vm = this;

		// to fix various iPhone / iPad oddities...
		/*
		var vh = $('body').outerHeight();
		$('.bigboy').css({'height': vh+'px'});
		*/

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

		vm.totalScore = 0;
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

		vm.showBurger = true;

		vm.state = 'showArticle';

		vm.mood = 'assets/icons/ic_sentiment_neutral_black_24px.svg';

		articleService.getArticle(128)
			.then(function(response) {
				$log.log(response);
				$log.log(Object.keys(response));
				vm.article.headline = response.headline;
				vm.article = response;
			});

		activate();

		function activate() {
			// prepArticle();
		}

		function prepArticle() {
			vm.article.bodyLines = [];
			vm.article.body.split('\n\n').forEach(function(pcontent) {
				vm.article.bodyLines.push(pcontent.replace('\n', 'BR'));
			});
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
					scoreSwipe('left');
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
					scoreSwipe('right');
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
			vm.progressPips[vm.curProgress] = (Math.random()>0.5 ? 'win' : 'lose');
			if (vm.progressPips[vm.curProgress]==='win') {
				vm.totalScore += 50;
				vm.mood = 'assets/icons/ic_mood_black_24px.svg';
			} else {
				vm.mood = 'assets/icons/ic_mood_bad_black_24px.svg';
			}
		}

		function nextQuestion() {
			if (vm.curProgress<vm.maxProgress-1) {
				vm.curProgress += 1;
			} else {
				vm.progressPips = [];
				for (var i=0; i<vm.maxProgress; i++) {
					vm.progressPips.push('');
				}
				vm.curProgress = 0;
			}
			vm.state = 'showArticle';
			vm.mood = 'assets/icons/ic_sentiment_neutral_black_24px.svg';
			vm.articleExpanded = false;
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
