const FormBase = require('../src/FormBase');

module.exports = class Test2Form extends FormBase {

  /**
   * @param {import('../Collector/FormCollector')} collector 
   */
  static define(collector) {
    collector.add('test2');
  }

  /**
   * @param {import('../src/FormBuilder')} builder 
   */
  build(builder) {
    builder
      .field({
        name: 'title',
        label: 'Title',
      })
      .field({
        type: 'submit',
        name: 'submit',
        label: 'Submit',
      });
  }

  async submit() {
    console.log('2', this.values);
  }

}