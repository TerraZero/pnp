const { Prisma, PrismaClient } = require('@prisma/client');

/**
 * @typedef {(tx: PrismaClient)} C_TransactionCallback
 */

/**
 * @typedef {Object} T_ModelFieldSchema
 * @property {Object} real
 * @property {string} name
 * @property {string} type
 * @property {boolean} required
 * @property {boolean} primary
 */

/**
 * @typedef {Object} T_ModelSchema
 * @property {Object} real
 * @property {string} name
 * @property {T_ModelFieldSchema[]} fields
 */

module.exports = class StorageService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('storage').setTag('rmi');
  }

  constructor() {
    this.prisma = new PrismaClient();
    this.transaction = null;
    this._schema = null;
  }

  get models() {
    return Prisma.dmmf.datamodel.models;
  }

  /** @returns {PrismaClient} */
  get database() {
    return (this.transaction || this.prisma);
  }

  /** @returns {T_ModelSchema[]} */
  get schema() {
    if (this._schema === null) {
      this._schema = this.models.map(model => {
        return {
          real: model,
          name: model.name,
          fields: model.fields.map(field => {
            return {
              real: field,
              name: field.name,
              type: field.documentation?.includes('[JSON]') ? 'Json' : field.type,
              required: field.isRequired,
              primary: field.isId,
            };
          }),
        };
      });
    }
    return this._schema;
  }

  /**
   * @param {string} name 
   * @param {string} field 
   * @returns {(T_ModelSchema|T_ModelFieldSchema)}
   */
  getSchema(model, field = null) {
    const schema = this.schema.find(v => v.name.toLowerCase() === model.toLowerCase());
    if (field === null) return schema;
    return schema.fields.find(v => v.name.toLowerCase() === field.toLowerCase());
  }

  /**
   * @param {C_TransactionCallback} callback 
   * @returns 
   */
  async inTransaction(callback) {
    if (this.transaction === null) {
      return await this.prisma.$transaction(async (transaction) => {
        this.transaction = transaction;
        const result = await callback(this.transaction);
        this.transaction = null;
        return result;
      });
    } else {
      return await callback(this.transaction);
    }
  }

}