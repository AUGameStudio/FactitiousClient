(function() {
	'use strict';

	angular.module('fact2')
		.controller('MainController', MainController);

	/** @ngInject */
	function MainController($scope, $log, swiperService, audioService, $window, $timeout, 
									articleService, gameState, $stateParams, dataTracking, playerService) {
		var vm = this;

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

		// for various debugging purposes...
		vm.isIphone = /(iPhone)/i.test(navigator.userAgent);
		vm.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
		vm.debugStr = ''+('webkitAudioContext' in $window);

		// this is stand-in stuff; the articleService now maintains the actual values here
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

		vm.inSwipe = false;

		vm.showBurger = false;

		vm.swipeLeft = swipeLeft;
		vm.swipeRight = swipeRight;
		vm.showHint = showHint;
		vm.nextQuestion = nextQuestion;
		vm.nextRound = nextRound;
		vm.startOver = startOver;
		vm.toggleBurger = toggleBurger;
		vm.quickStartGame = quickStartGame;
		vm.getSimClass = getSimClass;
		vm.setupForLaunch = setupForLaunch;
		vm.signOut = signOut;
		vm.resumeGame = resumeGame;
		vm.saveGame = saveGame;
		vm.showInstruct = showInstruct;

		setupForLaunch();
		// vm.state = 'showResult';

		$scope.$watch(function() {return gameState.state.roundNumber;}, function() {
			// slideInBanner();
		});

		$scope.$watch(function() {return vm.article;}, function() {
			vm.slideInArticle = true;
			$timeout(function() {
				vm.slideInArticle = false;
			}, 750);
		});

		function setupForLaunch() {
			vm.showBurger = false;
			vm.state = 'showLaunch';
			vm.checkingForUser = true;
			playerService.refreshPlayerInfo()
				.then(function() {
					vm.checkingForUser = false;
					vm.userIsAnonymous = playerService.isAnonymous;
					vm.userCanResume = playerService.canResume();
				});
		}

		function signOut() {
			playerService.signOut();
			vm.userIsAnonymous = playerService.isAnonymous;
			setupForLaunch();
			audioService.playACSound('btn');				
		}

		function startGame(allowResume) {
			$log.log('starting new game');
			vm.state = 'prepareArticle';

			audioService.playACSound('btnWipe');
			return playerService.refreshPlayerInfo()
				.then(function() {
					var gameLauncher;
					if (allowResume && playerService.canResume()) {
						$log.log('restore game');
						gameLauncher = gameState.restoreGame(playerService.playerInfo.current_game.pk);
					} else {
						$log.log('create new game');
						gameLauncher = gameState.beginNewGame(playerService.playerInfo.pk);
					}
					gameLauncher.then(function() {

						vm.numberOfRounds = gameState.state.roundInfo.length;

						if (gameState.state.articleNumber>=gameState.state.roundInfo[gameState.state.roundNumber].articleIds.length) {
							gameState.state.roundNumber += 1;
							gameState.state.articleNumber = 0;
						}

						vm.progressPips = gameState.state.roundInfo[gameState.state.roundNumber].progressPips;

						return articleService.getArticle(gameState.state.roundInfo[gameState.state.roundNumber].articleIds[gameState.state.articleNumber])
							.then(function(response) {
								vm.article = response;
								vm.state = 'showArticle';
								slideInBanner();
								$log.log('show first article');
								dataTracking.startArticle(vm.article.pk);
							});
					});
				});
		}

		function getSimClass() {
			if (vm.isPreview) {
				return vm.simClass;
			} else {
				return '';
			}
		}

		function resumeGame() {
			startGame(true);
		}

		function quickStartGame() {
			startGame(false);
		}

		function saveGame() {
			audioService.playACSound('btn');
			gameState.saveGame();
		}

		function showInstruct(val) {
			vm.showInstructions = val;
			audioService.playACSound('btn');
		}

		function swipeLeft(dragX) {
			// if (vm.shouldSwipe) return;
			vm.shouldSwipe = true;
			vm.inSwipeLeft = true;
			vm.inSwipe = true;
			if (vm.article.articleType==='notNews') {
				audioService.playACSound('whooshCorrect');
			} else {
				audioService.playACSound('whooshIncorrect');
			}
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
			if (vm.article.articleType==='news') {
				audioService.playACSound('whooshCorrect');
			} else {
				audioService.playACSound('whooshIncorrect');
			}
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
			audioService.playACSound('btn');
			$timeout(function() {
				$('.article-card').scrollTop($('.article-card').scrollTop()+50);
			}, 250);
		}

		function scoreSwipe(swipeDir) {
			var roundInfo = gameState.state.roundInfo[gameState.state.roundNumber];
			roundInfo.progressPips[gameState.state.articleNumber] = (swipeDir===vm.article.articleType ? 'win' : 'lose');
			if (roundInfo.progressPips[gameState.state.articleNumber]==='win') {
				if (vm.articleExpanded) {
					gameState.state.totalScore += gameState.game_settings.roundInfo[gameState.state.roundNumber].reward_with_hint;
				} else {
					gameState.state.totalScore += gameState.game_settings.roundInfo[gameState.state.roundNumber].reward;
				}
				vm.payoffType = 'correct';
			} else {
				vm.payoffType = 'incorrect';
			}
			dataTracking.endArticle(vm.article.pk, vm.payoffType==='correct', vm.articleExpanded);
		}

		function nextQuestion() {
			var roundInfo = gameState.state.roundInfo[gameState.state.roundNumber];
			gameState.state.articleNumber += 1;
			if (gameState.state.articleNumber<roundInfo.articleIds.length) {
				vm.state = 'prepareArticle';
				articleService.getArticle(roundInfo.articleIds[gameState.state.articleNumber])
					.then(function(response) {
						vm.article = response;
						vm.state = 'showArticle';
						vm.articleExpanded = false;
						dataTracking.startArticle(vm.article.pk);
					});
				audioService.playACSound('btnWipe');
			} else {
				gameState.saveGame();
				vm.state = 'showRoundResult';
				audioService.playACSound('btn');
			}
		}

		function nextRound() {
			gameState.state.roundNumber += 1;
			if (gameState.state.roundNumber>=gameState.state.roundInfo.length) {
				gameState.game_record.is_completed = true;
				gameState.saveGame();
				vm.state = "showGamePayoff";
				slideInBanner();
				audioService.playACSound('gameOver');
			} else {
				gameState.state.articleNumber = 0;
				vm.state = 'prepareArticle';

				vm.progressPips = gameState.state.roundInfo[gameState.state.roundNumber];

				articleService.getArticle(gameState.state.roundInfo[gameState.state.roundNumber].articleIds[gameState.state.articleNumber])
					.then(function(response) {
						vm.article = response;
						vm.state = 'showArticle';
						vm.articleExpanded = false;
						dataTracking.startArticle(vm.article.pk);
						slideInBanner();
					});
				audioService.playACSound('btnWipe');
			}
		}

		function startOver() {
			if (!gameState.game_record.is_completed) {
				gameState.game_record.was_cancelled = true;
				gameState.saveGame()
					.then(function() {
						vm.showBurger = false;
						setupForLaunch();
					});
			} else {
				vm.showBurger = false;
						setupForLaunch();
			}
			audioService.playACSound('btn');
		}

		function slideInBanner() {
			vm.showRoundBanner = true;
			vm.roundNumber = gameState.state.roundNumber;
			$timeout(function() {
				vm.showRoundBanner = false;
			}, 2000);
		}

		function toggleBurger() {
			vm.showBurger = !vm.showBurger;
			vm.showInstructions = false;
			if (vm.showBurger) {
				$('burger-pane .gray-section').scrollTop(0);
			}
			audioService.playACSound('btn');
		}

	}

})();
