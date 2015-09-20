function createClientSide(execlib) {
  'use strict';
  var execSuite = execlib.execSuite,
  UserExposerServicePack = execSuite.registry.get('allex_userexposerservice'),
  ParentServicePack = UserExposerServicePack;

  return {
    SinkMap: require('./sinkmapcreator')(execlib, ParentServicePack)
  };
}

module.exports = createClientSide;
