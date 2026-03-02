/**
 * @typedef {Object} T_FormBuilderOptions
 * @property {import('./FormBase')} form
 * @property {string[]} parents
 * @property {FormBuilder} wrapper
 */

/**
 * @typedef {Object} T_PropParse
 * @property {string} prop The original full prop name ":label:keyup@group.title"
 * @property {string} name The clean prop name "label"
 * @property {string} prefix The action type "@", ":"
 * @property {string} event The event name "change", ...
 * @property {string} path The path to another field "group.title"
 */

/**
 * @typedef {Object} T_PropHandlerContext
 * @property {FormField} field
 * @property {any} value
 * @property {T_PropParse} parse
 */

/**
 * @typedef {Object} T_PropHandlerItem
 * @property {string} prop
 * @property {(context: T_PropHandlerContext) => any} handler
 * @property {(context: T_PropHandlerContext) => any} init
 */

/**
 * @typedef {Object} T_TypeHandlerContext
 * @property {FormField} field
 * @property {import('../form.module').T_FormulateFieldOptions} schema
 */

/**
 * @typedef {Object} T_TypeHanderItem
 * @property {string} type
 * @property {(context: T_TypeHandlerContext) => any} prepare
 * @property {(context: T_TypeHandlerContext) => any} post
 */

const FormField = require('./FormField');

module.exports = class FormBuilder {

  /**
   * @param {T_TypeHanderItem} handler 
   * @returns {this}
   */
  static setTypeHandler(handler) {
    if (this._typeHandler === undefined) {
      this._typeHandler = {};
    }
    this._typeHandler[handler.type] = handler;
    return this;
  }

  /**
   * @param {string} type 
   * @returns {?T_TypeHanderItem}
   */
  static getTypeHandler(type) {
    return this._typeHandler && this._typeHandler[type] || null;
  }

  /**
   * @param {T_PropHandlerItem} handler 
   * @returns {this}
   */
  static setPropHandler(handler) {
    if (this._propHandler === undefined) {
      this._propHandler = {};
    }
    this._propHandler[handler.prop] = handler;
    return this;
  }

  /**
   * @param {string} propname 
   * @returns {?T_PropHandlerItem}
   */
  static getPropHandler(propname) {
    return this._propHandler && this._propHandler[propname] || null;
  }

  /**
   * @param {string} prop 
   * @returns {T_PropParse}
   */
  static getPropParse(prop) {
    let prefix = null;
    let value = prop;
    if (value.startsWith('@')) {
      prefix = '@';
      value = value.substring(1);
      return {
        prop, 
        name: value, 
        prefix, 
        event: value,
        path: '',
      };
    } else if (value.startsWith(':')) {
      prefix = ':';
      value = value.substring(1);
    }
    const [ name, eventpath = 'change' ] = value.split(':');
    const [ event, path = '' ] = eventpath.split('@');
    return {
      prop, 
      name, 
      prefix, 
      event,
      path,
    };
  }

  /**
   * @param {T_FormBuilderOptions} options 
   */
  constructor(options = {}) {
    this.form = options.form ?? null;
    this.parents = options.parents ?? [];
    this.wrapper = options.wrapper ?? null;
    this._group = null;
  }

  /**
   * @returns {import('./FormBase')}
   */
  getForm() {
    if (this.form === null) {
      return this.wrapper.getForm();
    } else {
      return this.form;
    }
  }

  /**
   * @param {(string|string[])} name 
   * @returns {string}
   */
  getFieldID(id) {
    if (Array.isArray(id)) {
      return id.join('.');
    } else {
      return id;
    }
  }

  /**
   * @param {(string|string[])} options
   * @returns {FormField}
   */
  getField(id) {
    return this.getForm().getField(this.getFieldID(id));
  }

  /**
   * @param {import('../form.module').T_FormulateFieldOptions} options 
   * @param {(builder: FormBuilder) => void} children
   * @param {?number} pos
   * @returns {this}
   */
  field(options, children = null, pos = null) {
    const schema = {};
    const field = new FormField(this, options.name, this.getFieldID([...this.parents, options.name]));
    this.getForm().addField(field);
    field.build = options;
    field.schema = schema;
    field.group = this._group;

    const typeHandler = this.getTypeHandler(options.type);
    if (typeHandler) typeHandler?.prepare({ field, schema: options });

    for (const prop in options) {
      const parse = this.constructor.getPropParse(prop);
      const handler = this.getPropHandler(parse.name);

      if (handler !== null && typeof handler.init === 'function') {
        handler.init({ field, value: options[prop], parse });
      }

      if (parse.prefix === '@' && typeof options[prop] === 'function') {
        field.on(parse.event, options[prop]);
      } else if (parse.prefix === ':' && typeof options[prop] === 'function') {
        if (parse.path) {
          const ref = this.getField(parse.path);
          ref.on(parse.event, (ctx) => {
            field.setSchema(parse, options[prop].call(schema, ctx));
          });
          ref.emit(parse.event);
        } else {
          field.on(parse.event, (ctx) => {
            field.setSchema(parse, options[prop].call(schema, ctx));
          });
          field.emit(parse.event);
        }
      } else if (typeof options[prop] === 'function') {
        field.on('change', (ctx) => {
          field.setSchema(parse, options[prop].call(schema, ctx));
        });
        field.emit('change');
      } else {
        field.setSchema(parse, options[prop]);
      }
    }

    if (typeHandler?.post) typeHandler?.post({ field, schema: options });

    this.addField(schema, pos);    

    if (typeof children === 'function') {
      children(new FormBuilder({ parents: [...this.parents, options.name], wrapper: this }));
    }

    return this;
  }

  /**
   * @param {Object} schema 
   * @param {?number} pos 
   * @returns {this}
   */
  addField(schema, pos = null) {
    const parent = this.getField(this.parents);

    const addToArray = (array, value) => {
      if (pos === null) {
        array.push(value);
      } else {
        array.splice(pos, 0, value);
      }
    };

    if (this.form === null) {
      if (this._group === null) {
        parent.schema.children ??= [];
        addToArray(parent.schema.children, schema);
      } else {
        parent.schema.group ??= {};
        parent.schema.group[this._group] ??= [];
        addToArray(parent.schema.group[this._group], schema);
      }
    } else {
      addToArray(parent.schema, schema);
    }

    return this;
  }

  /**
   * @param {(string|string[])} after
   * @param {import('../form.module').T_FormulateFieldOptions} options 
   * @param {(builder: FormBuilder) => void} children
   */
  fieldBefore(after, options, children = null) {
    const id = this.getFieldID(after);
    const field = this.getField(id);
    const pos = field.getParent().getChildrenIndex(field.name);
    return this.field(options, children, pos);
  }

  /**
   * @param {(string|string[])} after
   * @param {import('../form.module').T_FormulateFieldOptions} options 
   * @param {(builder: FormBuilder) => void} children
   * @returns {this}
   */
  fieldAfter(after, options, children = null) {
    const id = this.getFieldID(after);
    const field = this.getField(id);
    const pos = field.getParent().getChildrenIndex(field.name);
    return this.field(options, children, pos + 1);
  }

  /**
   * @param {(string|string[])} id 
   * @returns {this}
   */
  removeField(id) {
    id = this.getFieldID(id);
    const name = id.split('.').pop();
    const field = this.getField(id);
    const parent = field.getParent();
    if (field.group === null) {
      // if root 
      if (parent.id === '') {
        const index = parent.schema.findIndex(v => v.name === name);
        parent.schema.splice(index, 1);
      } else {
        const index = parent.schema.children.findIndex(v => v.name === name);
        parent.schema.children.splice(index, 1); 
      }
    } else {
      const index = parent.schema.group[field.group].findIndex(v => v.name === name);
      parent.schema.group[field.group].splice(index, 1);
    }
    const fieldIndex = this.form.fields.findIndex(v => v.id === id);
    this.form.fields.splice(fieldIndex, 1);
    return this;
  }

  /**
   * @param {string} group 
   * @returns {this}
   */
  group(group) {
    this._group = group;
    return this;
  }

  /**
   * @param {string} propname 
   * @returns {?T_PropHandlerItem}
   */
  getPropHandler(propname) {
    return this.constructor.getPropHandler(propname);
  }

  /**
   * @param {string} type 
   * @returns {?T_TypeHanderItem}
   */
  getTypeHandler(type) {
    return this.constructor.getTypeHandler(type);
  }

}