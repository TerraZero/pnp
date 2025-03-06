const RemoteSystem = require('zero-system/src/RemoteSystem');
const StringUtil = require('zero-util/src/StringUtil');

const FormBase = require('../../form/src/FormBase');

module.exports = class GenerateEditForm extends FormBase {

  /**
   * @param {import('~/custom/server/form/Collector/Form.collector')} collector 
   */
  static define(collector) {
    collector.add('generate.edit');
  }

  async prepare(info) {
    /** @type {import('../src/ContentEntityBase')} */
    this.generate = await RemoteSystem.get(info.params.generate);
    this.generateSchema = await this.generate.schema();

    if (info.params.id) {
      this.values = await this.generate.load(parseInt(info.params.id), true);
      if (this.values === null) {
        this.mount.setFatalError(`ERROR: No ${this.generate.info().label} with id "${info.params.id}"`);
      }
    }
  }

  /**
   * @param {import('../../form/src/FormBuilder')} builder 
   */
  build(builder) {
    for (const field of this.generateSchema.fields) {
      const item = {
        name: field.name,
        label: field.options.label ?? StringUtil.ucFirst(field.name),
        fieldschema: field,
      };

      switch (field.type) {
        case 'Int':
          item.type = 'number';
          break;
      }

      if (field.reference) {
        item.type = 'reference';
      }

      if (field.type === 'Int') {
        item.type = 'number';
      } else if (field.type === 'Json') {
        item.type = 'json';
      }

      if (field.options.disabled || field.primary) {
        item.disabled = true;
        if (this.info.params[field.name] !== undefined) {
          item.value = this.info.params[field.name];
        }
      }

      if (field.options.validation) {
        item.validation = field.options.validation;
        if (field.options['validation-name']) item['validation-name'] = field.options['validation-name'];
        item['error-behavior'] = 'live';
      }

      builder.field(item);
    }

    builder.field({
      type: 'wrapper',
      name: 'actions',
      layout: 'actions',
    }, builder => {
      builder
        .group('default')
        .field({
          type: 'action',
          name: 'submit',
          label: 'Submit',
        })
        .field({
          type: 'action',
          name: 'abort',
          label: 'Abort',
          '@action': this.onAbort.bind(this),
        });
    });
  }

  async submit() {
    const result = await this.generate.save(this.values);
    this.mount.$notify({
      title: 'Save',
      message: 'Save the entity ' + result.name,
      type: 'success',
      position: 'bottom-right',
    });

    if (this.mount.wsc) {
      this.mount.wsc.close(result);
    } else {
      const path = await this.generate.route('edit', result);
      if (path) {
        this.goto(path);
      }
    }

    this.values = await this.generate.load(parseInt(this.info.params.id), true);
  }

  onAbort() {
    if (this.mount.wsc) {
      this.mount.wsc.close('abort');
    } else {
      this.mount.$emit('abort', this);
    }
  }

}