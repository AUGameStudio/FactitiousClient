(function() {
  'use strict';

  angular
    .module('proto')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
