const JSONUtil = require('zero-util/src/JSONUtil');
const GenerateEditForm = require('../../entity/Form/GenerateEdit.form');

module.exports = class ConfigEntityForm extends GenerateEditForm {

  /**
   * @param {import('~/custom/server/form/Collector/Form.collector')} collector 
   */
  static define(collector) {
    collector.add('entity.config');
  }

  /**
   * @param {import('../../form/src/FormBuilder')} builder 
   */
  build(builder) {
    super.build(builder);
    builder.fieldBefore('actions', {
      name: 'test',
      label: 'Test',
      mount: 'value',
      mountpath: 'test.hier',
    });
  }

}