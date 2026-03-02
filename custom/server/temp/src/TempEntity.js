module.exports = class TempEntity {

  /**
   * @param {import('./TempEntityType')} type
   * @param {*} data 
   */
  constructor(type, data) {
    this._type = type;
    this.data = data;
  }

  meta() {
    return this.data._meta;
  }

  refs() {
    return this.data._refs;
  }

  /**
   * @returns {import('./TempEntityType')}
   */
  type() {
    return this._type;
  }

  id() {
    return this.data.id;
  }

  /**
   * @returns {string}
   */
  label() {
    return this.data.label ?? '[' + this.id() + ':' + this.type().id() + ']';
  }

  get(field) {
    return this.data[field] ?? null;
  }

  /**
   * @returns {Object}
   */
  values() {
    const clone = {};
    for (const key in this.data) {
      if (key.startsWith('_')) continue;
      clone[key] = this.data[key];
    }
    return structuredClone(clone);
  }

  /**
   * @param {string} field 
   * @param {number} index 
   * @returns {(TempEntity|TempEntity[])}
   */
  async getRef(field, index = null) {
    if (index === null) {
      const refs = [];
      for (const i in this.refs()[field]) {
        refs.push(await this.getRef(field, i));
      }
      return refs;
    } else {
      if (typeof this.refs()[field][index] === 'number') {
        this.refs()[field][index] = await this.type().storage.load(this.type().field(field).type, this.refs()[field][index]);
      }
      return this.refs()[field][index];
    }
  }

  /**
   * @param {string} field 
   * @returns {import('./TempEntityType')}
   */
  async getRefType(field) {
    return await this.type().getRefType(field);
  }

  /**
   * @param {string} field 
   * @param {number} index 
   * @param {(number|TempEntity)} value 
   * @returns {this}
   */
  setRef(field, index, value) {
    if (index === null || this.refs()[field].length === index) {
      this.refs()[field].push(value);
    } else {
      this.refs()[field][index] = value;
    }
    return this;
  }

  /**
   * @param {string} field 
   * @param {number} index 
   * @param {(number|TempEntity)} value 
   * @returns {this}
   */
  delRef(field, index = null, value = null) {
    if (index === null) {
      index = this.findRef(field, value);
    }
    this.refs()[field].splice(index, 1);
    return this;
  }

  /**
   * @param {string} field 
   * @param {(number|TempEntity)} value 
   * @returns {number}
   */
  findRef(field, value) {
    const id = this._getID(value);
    return this.refs()[field].findIndex(v => {
      return this._getID(v) === id;
    });
  }

  /**
   * @param {(number|string|TempEntity)} value
   * @returns {number}
   */
  _getID(value) {
    let id = value;
    if (id instanceof TempEntity) {
      id = id.data.id;
    }
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    if (typeof id === 'number') {
      return id;
    }
    throw new Error('Could not found id.');
  }

  pack() {
    const packed = {
      _meta: this.meta(),
    };
    for (const field of this.type().fields()) {
      if (field.reference) {
        packed._refs ??= {};
        const items = [];
        for (const item of this.refs()[field.name]) {
          if (item instanceof TempEntity) {
            items.push(item.pack());
          } else {
            items.push(item);
          }
        }
        packed._refs[field.name] = items;
      } else {
        packed[field.name] = this.data[field.name];
      } 
    }
    return structuredClone(packed);
  }

  async save() {
    return await this.type().storage.save(this);
  }

  async delete() {
    return await this.type().storage.delete(this);
  }

  /**
   * @param {string} route 
   * @param {Object} params 
   * @returns {string}
   */
  route(route, params = {}) {
    return this.type().route(route, this, params);
  }

  /**
   * @param {string} route 
   * @param {Object} params 
   */
  async goto(route, params = {}) {
    return this.type().goto(route, this, params);
  }

}