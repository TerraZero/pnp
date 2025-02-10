const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class RouterRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('router');
  }

  windowStack() {
    return RemoteSystem.getComponent('window.stack');
  }

  router() {
    return this.windowStack().$router;
  }

  goto(path) {
    this.router().push(path);
  }

  open(component, params = [], info = {}, parent = null) {
    this.windowStack().addComponent(component, params, info, parent);
  }

  close(key) {
    this.windowStack().closeComponent(key);
  }

  get(key) {
    return this.windowStack().getComponent(key);
  }

}