(function() {
  'use strict';

  angular
    .module('proto')
    .controller('MainController', MainController)
    .directive('scrolly', scrolly)
    .directive('trackSwipe', trackSwipe);

  /** @ngInject */
  function MainController($scope, $log, swiperService) {
    var vm = this;

    vm.isIphone = /(iPhone)/i.test(navigator.userAgent);
    vm.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);    

    vm.article = {
      headline: 'This is the headline. This will always be the headline.',
      source: 'Op-Ed Article, Albert Camus',
      publisher: 'Bourbaki News',
      body: 'Electron capture is a decay which happens in many proton-rich, heavy nuclei. You can envision the situation in your title as "forced electron capture".\n\nSquishing atoms together at such high densities makes it energetically favorable for electrons to be destroyed so that the resulting particles can occupy lower energy levels.\n\nThere\'s no need to think about nuclei at the quark level, but you certainly can. The actual matter in neutron stars is in the form of exotic phases of nuclear matter rather than discrete nuclei, but anyway what I said above gives a good heuristic description.\n\nIt\'s not just the electron that turns into a neutrino and neutron, it\'s both the electron and the proton, so there\'s no net change of charge.'
    };
    vm.article.body += '\n\n'+vm.article.body;

    vm.curProgress = 5;
    vm.maxProgress = 15;

    vm.swipeLeft = swipeLeft;
    vm.swipeRight = swipeRight;
    vm.showHint = showHint;

    activate();

    function activate() {
      prepArticle();
    }

    function prepArticle() {
      vm.article.bodyLines = [];
      vm.article.body.split('\n\n').forEach(function(pcontent) {
        vm.article.bodyLines.push(pcontent.replace('\n', 'BR'));
      });
    }

    function swipeLeft() {
        if (vm.shouldSwipe) return;
        vm.shouldSwipe = true;
        vm.inSwipeLeft = true;
        swiperService.swipeCard($scope, $('.article-card'), 'left')
            .then(function() {
                $log.log('Main swiped!')
                vm.shouldSwipe = false;
            });
    }

    function swipeRight() {
        if (vm.shouldSwipe) return;
        vm.shouldSwipe = true;
        vm.inSwipeRight = true;
        swiperService.swipeCard($scope, $('.article-card'), 'right')
            .then(function() {
                $log.log('Main swiped!')
                vm.shouldSwipe = false;
            });
    }

    function showHint() {
        vm.article.expanded = true;
    }


  }

  /** @ngInject */
  function scrolly($log, $timeout) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, elm) {
      $timeout(function() {$(elm).scrollTop(1);}, 100);
      scope.$watch(function() {return scope.main.article.expanded;}, function() {
        if (!scope.main.article.expanded) {
          $(elm).scrollTop(1);
        }
      });
      elm.on('scroll', function(e) {
        // $log.log(e);
        // $log.log(elm.scrollTop());
        if (elm.scrollTop()<=0 && !scope.main.inSwipeLeft && !scope.main.inSwipeRight) {
          scope.main.article.expanded = true;
          scope.$apply();
        }
      });
    }
  }

  /** @ngInject */
  function trackSwipe($log, $timeout, swiperService) {

    return {
      restrict: 'A',
      link: link
    };

    function link(scope, elm) {
      var anchorX, dragX;

      var triggerThreshold = 50;
      var swipeThreshold = 150;
      var shouldSwipe = false;

      elm.on('mousedown', trackDown);
      elm.on('touchstart', trackDown);

      function trackDown(e) {
        if (shouldSwipe) {
          // debounce...
          return;
        }
        anchorX = getPageX(e);

        elm.on('mousemove', trackMove);
        elm.on('touchmove', trackMove);
        elm.on('mouseleave', trackUp);
        elm.on('mouseup', trackUp);
        elm.on('touchend', trackUp);
      }

      function trackUp(e) {
        if ((scope.main.inSwipeLeft || scope.main.inSwipeRight) && shouldSwipe) {
          swiperService.swipeCard(scope, elm.find('.article-card'), (scope.main.inSwipeLeft ? 'left' : 'right'), dragX)
            .then(function() {
              $log.log('swiped');
              scope.main.shouldSwipe = shouldSwipe = false;
            });
        } else {
          elm.find('.article-card').css('transform', '');
          scope.main.inSwipeLeft = scope.main.inSwipeRight = false;
          scope.main.shouldSwipe = shouldSwipe = false;
        }
        releaseListeners();
        scope.$apply();
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
})();
