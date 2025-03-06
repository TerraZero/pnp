const RemoteSystem = require('zero-system/src/RemoteSystem');
const JSONUtil = require('zero-util/src/JSONUtil');

const FormBuilder = require('./FormBuilder');
const FormField = require('./FormField');

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
    this.fields.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
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

  async doSubmit() {
    await this.system.events.trigger(FormBase.EVENT__FORM_SUBMIT, { form: this });
    await this.submit();
  }

  /**
   * @param {import('../src/FormBuilder')} builder 
   */
  build(builder) { }

  async prepare(info) { }

  async submit() { }

}