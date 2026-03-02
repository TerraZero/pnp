const RemoteSystem = require('zero-system/src/RemoteSystem');
const JSONUtil = require('zero-util/src/JSONUtil');

const FormBuilder = require('./FormBuilder');
const FormField = require('./FormField');

/**
 * @typedef {Object} E_FormSubmitEvent
 * @property {import('./FormBase')} form
 * @property {Object} values
 */

/**
 * @typedef {Object} E_FormSchemaBuildEvent
 * @property {import('./FormBase')} form
 * @property {FormBuilder} builder
 */

module.exports = class FormBase {

  static EVENT__FORM_SCHEMA_BUILD = 'form:schema:build';
  static EVENT__FORM_PREPARE = 'form:prepare';
  static EVENT__FORM_SUBMIT = 'form:submit';

  /**
   * Create always a new instance and don't cache it.
   * @param {import('zero-system/src/RemoteSystem')} system
   * @returns {typeof this}
   */
  static factory(system) {
    return new this(system);
  }

  /**
   * @param {(event: E_FormSchemaBuildEvent) => void} listener 
   * @param {string} filterType
   * @returns {this}
   */
  static onSchemaBuild(listener, filterType = null) {
    if (filterType === null) {
      RemoteSystem.events.on(FormBase.EVENT__FORM_SCHEMA_BUILD, listener);
    } else {
      RemoteSystem.events.on(FormBase.EVENT__FORM_SCHEMA_BUILD, event => {
        if (event.form.info.params.generate === 'entity.' + filterType) {
          listener(event);
        }
      });
    }
    return this;
  }

  /**
   * @param {(event: E_FormSubmitEvent) => void} listener 
   * @param {string} filterType
   * @returns {this}
   */
  static onFormSubmit(listener, filterType = null) {
    if (filterType === null) {
      RemoteSystem.events.on(FormBase.EVENT__FORM_SUBMIT, listener);
    } else {
      RemoteSystem.events.on(FormBase.EVENT__FORM_SUBMIT, event => {
        if (event.form.info.params.generate === 'entity.' + filterType) {
          listener(event);
        }
      });
    }
    return this;
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  constructor(system) {
    this.system = system;
    this.mount = null;
    this.fields = [];
    this.info = null;
    this._schema = null;
  }

  setMount(mount) {
    this.mount = mount;
    return this;
  }

  get values() {
    return this.mount.values;
  }

  set values(value) {
    this.mount.values = value;
  }

  async goto(url) {
    return (await this.system.get('remote.router')).goto(url);
  }

  /**
   * @param {string} id 
   * @returns {any}
   */
  getValue(id) {
    if (this.values === null) return null;
    return JSONUtil.getDeep(this.values, id.split('.').join('.0.'));
  } 

  /**
   * @param {string} id 
   * @param {any} value 
   * @returns {this}
   */
  setValue(id, value) {
    this.values ??= {};
    JSONUtil.setDeep(this.values, id, value);
    return this;
  }

  /**
   * @param {string} id 
   * @returns {FormField}
   */
  getField(id) {
    return this.fields.find(item => item.id === id)?.field ?? null;
  }

  /**
   * @param {FormField} field 
   * @returns {this}
   */
  addField(field) {
    this.fields.push({
      id: field.id,
      field,
    });
    this.fields.sort((a, b) => a.id.localeCompare(b.id));
    return this;
  }

  schema() {
    if (this._schema === null) {
      this._schema = [];
      const builder = new FormBuilder({ form: this });
      const root = new FormField(builder, '', '');
      root.schema = this._schema;
      this.addField(root);
      this.build(builder);
      this.system.events.emit(FormBase.EVENT__FORM_SCHEMA_BUILD, { form: this, builder });
    }
    return this._schema;
  }

  async doPrepare(info = {}) {
    this.info = info;
    this.system.events.trigger(FormBase.EVENT__FORM_PREPARE, { form: this, info });
    await this.prepare(info);
  }

  async doFinalize() {
    // Mounting
    for (const field of this.fields) {
      let value = null;
      if (field.field.build?.mount) {
        const mount = this.getField(field.field.build.mount);
        value = mount.getValue();
        if (field.field.build.mountpath) {
          value = JSONUtil.getDeep(value, field.field.build.mountpath);
        }
        field.field.setValue(value);
      }
    }

    await this.finalize();
    this.values = { ...this.values };
    this.mount.$emit('ready', { form: this });
  }

  async doSubmit(values = null) {
    // Mounting
    for (const field of this.fields) {
      if (field.field.build?.mount) {
        const mount = this.getField(field.field.build.mount);
        if (field.field.build.mountpath) {
          JSONUtil.setDeep(values, [field.field.build.mount, field.field.build.mountpath].join('.'), field.field.getValue());
        } else {
          JSONUtil.setDeep(values, field.field.build.mount, field.field.getValue());
        }
        JSONUtil.removeDeep(values, field.id);
      }
    }

    values ??= JSON.parse(JSON.stringify(this.values));
    await this.system.events.trigger(FormBase.EVENT__FORM_SUBMIT, { form: this, values });
    await this.submit(values);
  }

  /**
   * @param {import('../src/FormBuilder')} builder 
   */
  build(builder) { }

  async setup(mount) { }

  async rebuild() { }

  async prepare(info) { }

  async finalize() { }

  /**
   * @param {Object} values 
   */
  async submit(values) { }

}