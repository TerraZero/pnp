module.exports = class MapWindow {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('map');
  }

  windows() {
    return {
      'entity.map.editor': {
        path: '/map/:entity_id/editor',
        title: 'Map Editor',
        component: 'Entity/ZUI/Form',
        params: {
          form: 'form.generate.edit',
          entity_type: 'map',
        },
        zui: {
          width: '90%',
          height: '80%',
          position: 'center',
        },
      },
    };
  }

}