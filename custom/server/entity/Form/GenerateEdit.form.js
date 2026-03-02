const RemoteSystem = require('zero-system/src/RemoteSystem');
const StringUtil = require('zero-util/src/StringUtil');

const FormBase = require('../../form/src/FormBase');
const JSONUtil = require('zero-util/src/JSONUtil');

module.exports = class GenerateEditForm extends FormBase {

  /**
   * @param {import('~/custom/server/form/Collector/Form.collector')} collector 
   */
  static define(collector) {
    collector.add('generate.edit');
  }

  windowStack() {
    return RemoteSystem.getComponent('window.stack');
  }

  async setup(mount) {
    /** @type {import('../src/ContentEntityBase')} */
    let entity = null;
    try {
      /** @type {import('../src/ContentEntityBase')} */
      entity = await RemoteSystem.get(mount.info.params.generate);
      const info = await entity.info();
      if (info.form) return info.form;
    } catch (e) {
      if (entity === null) {
        mount.setFatalError(`ERROR: The entity type "${mount.info.params.entity_type}" does not exist. Details: ${e.message}`);
      } else {
        mount.setFatalError(`ERROR: ${e.message}`);
      }
    }
  }

  async prepare(info) {
    /** @type {import('../src/ContentEntityBase')} */
    this.generate = await RemoteSystem.get(info.params.generate);
    this.generateSchema = await this.generate.schema();
    this.generateConfig = await this.generate.config();

    if (info.params.id) {
      await this.rebuild();
      if (this.values === null) {
        this.mount.setFatalError(`ERROR: No ${this.generate.info().label} with id "${info.params.id}"`);
      }
    }
  }

  /** @returns {import('../src/ContentEntityBase')} */
  get storage() {
    return this.generate;
  }

  /**
   * @param {import('../../form/src/FormBuilder')} builder 
   */
  build(builder) {
    if (!this.generateSchema) {
      this.windowStack().popup({
        type: 'error',
        title: 'Generate edit form',
        message: `No DB schema found for "${this.info.params.generate}" please add a "table" definition into the entity plugin info().`,
      });
      return;
    }
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

      if (field.type === 'Json') {
        item.type = 'json';
      }

      if (field.options.disabled || field.primary) {
        console.log(field);
        item.disabled = true;
        if (this.info.params[field.name] !== undefined) {
          item.value = this.info.params[field.name];
        } else if (field.options.fillable) {
          item.disabled = false;
        }
      }

      if (field.options.validation) {
        item.validation = field.options.validation;
        if (field.options['validation-name']) item['validation-name'] = field.options['validation-name'];
        item['error-behavior'] = 'live';
      }

      builder.field(item);
    }

    if (this.generateConfig.length) {
      builder.field({
        type: 'wrapper',
        name: 'config',
        layout: {
          comp: 'LayoutGrid',
          columns: 1,
          fieldset: 'Config',
          gap: '.5em',
        },
      }, builder => {
        for (const config of this.generateConfig) {
          builder.group('default').field(config);
        }
      });
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
        })
        .field({
          type: 'action',
          name: 'debug',
          label: 'Debug',
          '@action': this.onDebug.bind(this),
        });
    });
  }

  async doSubmit(values = null) {
    try {
      values ??= JSON.parse(JSON.stringify(this.values));
      for (const config of this.generateConfig) {
        values.value ??= {};
        values.value.config ??= {};
        JSONUtil.setDeep(values.value.config, config.mount ?? config.name, values[config.name]);
        delete values[config.name];
      }
      await super.doSubmit(values);
      this.mount.$emit('submit', this);
    } catch (e) {
      console.error(e);
      this.windowStack().notify({
        type: 'error',
        title: 'Save',
        message: `Error trying to save the "${this.info.params.generate}".`,
        duration: 0,
        onClick: () => {
          this.windowStack().popup({
            type: 'error',
            title: `Error trying to save the "${this.info.params.generate}".`,
            message: '<pre>' + e.message + '</pre>',
            wide: true,
          });
        },
      });
    }
  }

  /**
   * @param {Object} values 
   */
  async submit(values) {
    const result = await this.generate.save(values);
    const labelkey = await this.generate.key('label');
    this.windowStack().notify({
      type: 'success',
      title: 'Save',
      message: `Save the entity "${result[labelkey]}"`,
    });

    
    if (!this.mount.zuiw) {
      if (this.mount.wsc) {
        this.mount.wsc.close(result);
      } else {
        const path = await this.generate.route('edit', result);
        if (path) {
          this.goto(path);
        }
      }
    }

    await this.rebuild();
    await this.doFinalize();
  }

  onAbort() {
    if (this.mount.wsc) {
      this.mount.wsc.close('abort');
    } else {
      this.mount.$emit('abort', this);
    }
  }

  onDebug() {
    console.debug(this.values);
    const state = JSON.stringify(this.values, null, 2);
    this.windowStack().notify({
      type: 'info',
      title: 'Debug',
      message: 'Values of this submit',
      duration: 0,
      onClick: () => {
        this.windowStack().popup({
          type: 'info',
          title: `Values of this form`,
          message: '<pre>' + state + '</pre>',
          wide: true,
        });
      },
    });
  }

  async rebuild() {
    this.values = await this.generate.loadByParams(this.info.params, true);
    for (const config of this.generateConfig) {
      if (this.values?.value?.config) {
        this.values[config.name] = JSONUtil.getDeep(this.values.value.config, config.mount ?? config.name);
      }
    }
    if (this.values !== null) {
      this.mount.$emit('entity', { entity: this.values, storage: this.storage, form: this });
    }
  }

}