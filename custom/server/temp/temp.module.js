const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class TempModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('temp');
  }

  /**
   * @param {import('./ZeroRoot')} root 
   */
  constructor(root) {
    super(root);
    this.screen = null;
    this.control = null;
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server')} server 
   */
  setupModuleSocket(server) {
    let connectControl = false;
    let connectScreen = false;
    setInterval(() => {
      if (connectControl) {
        connectControl = false;
      } else {
        this.control = null;
      } 
      if (connectScreen) {
        connectScreen = false;
      } else {
        this.screen = null;
      }
    }, 3000);
    server.addHandler('temp.register.screen', async (request, mount, answer) => {
      if (this.screen?.id !== mount.id) {
        this.screen = mount;
      }
      connectScreen = true;
      answer({
        status: 'ok',
        control: !!this.control,
        screen: !!this.screen,
      });
    });

    server.addHandler('temp.register.control', async (request, mount, answer) => {
      if (this.control?.id !== mount.id) {
        this.control = mount;
      }
      connectControl = true;
      answer({
        status: 'ok',
        control: !!this.control,
        screen: !!this.screen,
      });
    });

    server.addHandler('temp.command.control', async (request, mount, answer) => {
      if (this.control) {
        const response = await this.control.request('command.control', request.data);
        answer({ response });
      } else {
        answer({
          error: 'No control mount.',
        });
      }
    });

    server.addHandler('temp.command.screen', async (request, mount, answer) => {
      if (this.screen) {
        const response = await this.screen.request('command.screen', request.data);
        answer({ response });
      } else {
        answer({
          error: 'No screen mount.',
        });
      }
    });
  }

}