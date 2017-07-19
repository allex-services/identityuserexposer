function createServicePack(execlib) {
  'use strict';

  return {
    service: {
      dependencies: ['allex_userexposerservice']
    },
    sinkmap: {
      dependencies: ['allex_userexposerservice']
    }
  };
}

module.exports = createServicePack;

