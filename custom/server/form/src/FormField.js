/**
 * @typedef {Object} T_EventContext
 * @property {import('./FormBase')} form
 * @property {string} event
 * @property {import('./FormField')} field
 * @property {any[]} args
 */

/**
 * @callback C_EventListener
 * @param {T_EventContext} ctx
 */

module.exports = class FormField {

  /**
   * @param {import('./FormBuilder')} builder 
   * @param {string} name 
   * @param {string} id 
   */
  constructor(builder, name, id) {
    this.builder = builder;
    this.name = name;
    this.id = id;
    this.build = null;
    this.schema = null;
    this.events = {};
    this.state = {};
  }

  /**
   * @param {import('./FormBuilder').T_PropParse} parse 
   * @param {any} value 
   * @returns {this}
   */
  setSchema(parse, value) {
    const item = this.builder.getPropHandler(parse.name);
    if (item) {
      item.handler({ field: this, value, parse });
    } else {
      this.schema[parse.name] = value;
    }
    return this;
  }

  /**
   * @param  {...string} classes 
   * @returns {this}
   */
  addClass(...classes) {
    let items = [];
    if (typeof this.schema.class === 'string') {
      items = this.schema.class.trim().split(' ');
    }
    items.push(...classes.filter(item => !items.includes(item)));
    this.schema.class = items.join(' ');
    return this;
  }

  /**
   * @param  {...string} classes 
   * @returns {this}
   */
  removeClass(...classes) {
    let items = [];
    if (typeof this.schema.class === 'string') {
      items = this.schema.class.trim().split(' ');
    }
    const removeIndex = [];
    for (const item of classes) {
      if (item.startsWith('^')) {
        removeIndex.push(...items.map((v, i) => {
          return v.startsWith(item.substring(1)) ? i : null;
        }).filter(v => v !== null));
      } else if (item.startsWith('$')) {
        removeIndex.push(...items.map((v, i) => {
          return v.endsWith(item.substring(1)) ? i : null;
        }).filter(v => v !== null));
      } else {
        const index = items.indexOf(item);
        if (index !== -1) {
          removeIndex.push(index);
        }
      }
    }
    [...new Set(removeIndex)].sort((a, b) => b - a).map(index => {
      items.splice(index, 1);
    });
    this.schema.class = items.join(' ');
    return this;
  }

  /**
   * @param {string} event 
   * @param {C_EventListener} listener 
   * @returns {this}
   */
  on(event, listener) {
    this.events[event] ??= [];
    this.events[event].push(listener);
    if (this.schema['@' + event] === undefined) {
      this.schema['@' + event] = (...args) => {
        const ctx = {
          form: this.builder.getForm(),
          event,
          field: this,
          args,
        };

        for (const listener of this.events[event]) {
          listener(ctx);
        }
      };
    }
    return this;
  }

  /**
   * @param {string} event 
   * @param  {...any} args 
   * @returns {this}
   */
  emit(event, ...args) {
    const ctx = {
      form: this.builder.getForm(),
      event,
      field: this,
      args,
    };

    for (const listener of this.events[event]) {
      listener(ctx);
    }
    return this;
  }

}