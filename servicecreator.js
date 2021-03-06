function createIdentityUserExposerService(execlib, ParentService) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    registry = execSuite.registry,
    taskRegistry = execSuite.taskRegistry;

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function IdentityUserExposerService(prophash) {
    /*
    if (!prophash.identity) {
      throw new lib.Error('NO_IDENTITY_IN_PROPERTYHASH', 'Constructor misses the identity field in propertyhash');
    }
    if (!prophash.entrypoint) {
      throw new lib.Error('NO_ENTRYPOINT_IN_PROPERTYHASH', 'Constructor misses the entrypoint field in propertyhash');
    }
    */
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
    registry.registerClientSide('allex_entrypointservice').then(
      this.onEntryPointService.bind(this)
    );
  };

  IdentityUserExposerService.prototype.onEntryPointService = function () {
    if (!this.destroyed) {
      return;
    }
    taskRegistry.run('getIn', {
      ipaddress: this.entrypoint.address,
      port: this.entrypoint.port,
      identity: this.identity,
      cb: this.onGetIn.bind(this),
      propertyhash: {nochannels: true}
    });
  };

  IdentityUserExposerService.prototype.onGetIn = function (getinobj) {
    if (!getinobj) {
      return;
    }
    if (getinobj.task) {
      getinobj.task.destroy();
    }
    this.setOuterSink(getinobj.sink);
  };

  IdentityUserExposerService.prototype.propertyHashDescriptor = {
    identity: {
      type: 'object'
    },
    entrypoint: {
      type: 'object'
    }
  };
  
  return IdentityUserExposerService;
}

module.exports = createIdentityUserExposerService;
