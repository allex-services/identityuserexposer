function createServicePack(execlib) {
  'use strict';

  return {
    service: {
      dependencies: ['allex:userexposer']
    },
    sinkmap: {
      dependencies: ['allex:userexposer']
    }
  };
}

module.exports = createServicePack;

