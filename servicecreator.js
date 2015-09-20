function createIdentityUserExposerService(execlib, ParentServicePack) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    registry = execSuite.registry,
    taskRegistry = execSuite.taskRegistry,
    ParentService = ParentServicePack.Service;

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function IdentityUserExposerService(prophash) {
    if (!prophash.identity) {
      throw new lib.Error('NO_IDENTITY_IN_PROPERTYHASH', 'Constructor misses the identity field in propertyhash');
    }
    if (!prophash.entrypoint) {
      throw new lib.Error('NO_ENTRYPOINT_IN_PROPERTYHASH', 'Constructor misses the entrypoint field in propertyhash');
    }
    ParentService.call(this, prophash);
    this.identity = prophash.identity;
    this.entrypoint = prophash.entrypoint;
  }
  
  ParentService.inherit(IdentityUserExposerService, factoryCreator);
  
  IdentityUserExposerService.prototype.__cleanUp = function() {
    this.entrypoint = null;
    this.identity = null;
    ParentService.prototype.__cleanUp.call(this);
  };

  IdentityUserExposerService.prototype.obtainOuterSink = function () {
    registry.register('allex_entrypointservice').then(
      this.onEntryPointService.bind(this)
    );
  };

  IdentityUserExposerService.prototype.onEntryPointService = function () {
    try {
    taskRegistry.run('getIn', {
      ipaddress: this.entrypoint.ipaddress,
      port: this.entrypoint.port,
      identity: this.identity,
      cb: this.setOuterSink.bind(this)
    });
    } catch (e) {
      console.error(e.stack);
      console.error(e);
    }
  };
  
  return IdentityUserExposerService;
}

module.exports = createIdentityUserExposerService;
