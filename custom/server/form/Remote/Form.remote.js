const FormBase = require('../src/FormBase');
const FormBuilder = require('../src/FormBuilder');

module.exports = class FormRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('form');
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  static async setupInit(system) {
    FormBuilder.setPropHandler({
      prop: 'grid',
      handler: ({ field, value }) => {
        field.removeClass('^form-grid-');
        if (value) {
          field.addClass('form-grid-' + value);
        }
      },
    });
    FormBuilder.setPropHandler({
      prop: 'frame',
      handler: ({ field, value }) => {
        if (value) {
          field.addClass('form-frame');
        } else {
          field.removeClass('form-frame');
        }
      },
    });
    FormBuilder.setPropHandler({
      prop: 'hide',
      handler: ({ field, value }) => {
        if (value) {
          field.addClass('form-hide');
        } else {
          field.removeClass('form-hide');
        }
      },
    });
    system.events.on(FormBase.EVENT__FORM_SUBMIT, ({ form }) => {
      console.log(form.values);
    });
  }

}