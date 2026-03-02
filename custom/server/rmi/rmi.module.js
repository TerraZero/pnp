const SystemCollector = require('zero-system/src/SystemCollector');
const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class RMIModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

  /**
   * @param {ZeroModule} root 
   */
  constructor(root) {
    super(root);
    this.info = null;
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server')} server 
   */
  setupModuleSocket(server) {
    server.addHandler('rmi.info', async (request, mount, answer) => {
      answer({
        info: this.getInfo(),
      });
    });
    server.addHandler('rmi.method', async (request, mount, answer) => {
      try {
        const args = [...request.data.args];
        for (const index in args) {
          if (typeof args[index] === 'string' && args[index] === '{{REQUEST}}') {
            args[index] = request;
          }
        }
        answer({
          result: await SystemCollector.get(request.data.info.name)[request.data.method](...args),
        });
      } catch (error) {
        request.meta.error = error;
        request.meta.details = {
          name: request.data.info.name,
          method: request.data.method,
          args: request.data.args,
        };
        answer({ result: error.message });
      }
    });
  }

  getInfo() {
    if (this.info === null) {
      this.info = SystemCollector.finds(item => item.hasTag('rmi')).map(item => {
        return {
          name: item.name,
          tags: item.info.tags ?? [],
          attributes: item.info.attributes ?? {},
        };
      });
    
    }
    return this.info;
  }

}