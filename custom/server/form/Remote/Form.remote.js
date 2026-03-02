const FormBase = require('../src/FormBase');
const FormBuilder = require('../src/FormBuilder');

module.exports = class FormRemote {

  /**
   * @param {import('zero-system/src/Collector/Remote.collector')} collector 
   */
  static define(collector) {
    collector.add('form');
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  static async setupInit(system) {
    this._system = system;
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
    FormBuilder.setTypeHandler({
      type: 'action',
      prepare: ({ field, schema }) => {
        const form = field.builder.getForm();
        if (schema['@action'] === undefined) {
          schema['@action'] = () => { 
            form.doSubmit();
            if (typeof form.mount.onSubmit === 'function') {
              form.mount.onSubmit();
            }
          };
        }
      },
    });
    system.events.on(FormBase.EVENT__FORM_SUBMIT, ({ form, values }) => {
      console.log('values', form.values, values);
    });
  }

  get system() {
    return this.constructor._system;
  }

  async open(form, params, info = {}, resolve = null) {
    const router = await this.system.get('remote.router');
    const componente = router.open('ZeroFormulate', { info: { params }, form }, info);
    if (typeof resolve === 'function') {
      componente.events.on('resolve', resolve);
    }
    return componente;
  }

}