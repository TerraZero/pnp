module.exports = class EntityWindow {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  windows() {
    return {
      'entity.edit': {
        path: '/entity/:entity_type/:entity_id(/:mode)',
        title: 'Audio Entity',
        defaults: {
          mode: 'form',
        },
        component: 'Entity/ZUI/Form',
        params: {
          form: 'form.generate.edit',
        },
        zui: {
          width: '50%',
          height: '50%',
          position: 'center',
        },
      },
      'entity.add': {
        path: '/entity/:entity_type',
        component: 'Entity/ZUI/Form',
        params: {
          form: 'form.generate.edit',
        },
        zui: {
          width: '50%',
          height: '50%',
          position: 'center',
        },
      },
    };
  }

}