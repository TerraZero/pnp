const { Prisma, PrismaClient } = require('@prisma/client');
const SystemCollector = require('zero-system/src/SystemCollector');
const Util = require('../../Util');

/**
 * @typedef {(tx: PrismaClient)} C_TransactionCallback
 */

/**
 * @typedef {Object} T_ModelFieldSchemaOptions
 * @property {string} [key] Defined keywords are: id, label
 * @property {string} [label] The label of this field
 * @property {any} [fallback] The fallback value of this field
 * @property {string} [type] The type of this field
 * @property {string} [list_type] The type of the list items (Saved as json)
 */

/**
 * @typedef {Object} T_ModelFieldRealSchema
 * @property {string} name
 * @property {string} type
 * @property {boolean} isId
 * @property {boolean} isRequired
 * @property {boolean} hasDefaultValue
 * @property {any} default
 */

/**
 * @typedef {Object} T_ModelFieldSchema
 * @property {T_ModelFieldRealSchema} real
 * @property {string} name
 * @property {string} type
 * @property {boolean} required
 * @property {boolean} reference
 * @property {boolean} primary
 * @property {T_ModelFieldSchemaOptions} options
 */

/**
 * @typedef {Object} T_ModelSchemaOptions
 * @property {Object<string, string>} [routes]
 * @property {Object} [meta]
 * @property {boolean} [meta.temp]
 * @property {string} [meta.label]
 */

/**
 * @typedef {Object} T_ModelSchema
 * @property {Object} real
 * @property {T_ModelSchemaOptions} options
 * @property {string} name
 * @property {T_ModelFieldSchema[]} fields
 */

module.exports = class StorageService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('storage');
  }

  static EVENT_SCHEMA_ALTER = 'storage.schema.alter';

  /**
   * @param {string} input 
   * @returns {Object}
   */
  static getObjectParse(input) {
    let object = {};
    const lines = input.split('\\n');

    for (const line of lines) {
      const match = line.match(/\{.*\}/s);
      if (match) {
        try {
          const value = Function(`'use strict'; return (${match[0]})`)();
          object = Util.deepMergeOptions(object, value);
        } catch (error) {
          console.error("Invalid JavaScript object format:", line, error);
        }
      }
    }
    return object;
  }

  constructor() {
    this.prisma = new PrismaClient();
    this.transaction = null;
    this._schema = null;
  }

  get timestamp() {
    return Math.floor(Date.now() / 1000);
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
          options: StorageService.getObjectParse(model.documentation ?? ''),
          fields: model.fields.map(field => {
            return {
              real: field,
              name: field.name,
              type: field.documentation?.includes('[JSON]') ? 'Json' : field.type,
              required: field.isRequired,
              primary: field.isId,
              reference: field.kind === 'object',
              options: StorageService.getObjectParse(field.documentation ?? ''),
            };
          }),
        };
      });
      SystemCollector.get('root').events.emit(StorageService.EVENT_SCHEMA_ALTER, { storage: this, schema: this._schema });
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
   * @returns {string[]}
   */
  getSchemaKeys() {
    return this.schema.map(v => v.name);
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