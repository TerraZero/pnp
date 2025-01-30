/**
 * @typedef {Object} T_FormulateFieldOptions
 * @property {string} label - The label for the field.
 * @property {string} name - The name attribute for the input field.
 * @property {string} type - The type of the input (e.g., "text", "password", "select", "checkbox").
 * @property {string} [validation] - Validation rules as a string (e.g., "required|min:3").
 * @property {Array<string|number|Object>} [options] - For select, radio, or checkbox fields, the list of options.
 * @property {boolean} [repeatable=false] - Whether the field is repeatable.
 * @property {boolean} [showLabel=true] - Whether to show the label.
 * @property {boolean} [disabled=false] - Whether the field is disabled.
 * @property {boolean} [required=false] - Whether the field is required.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {Object} [attrs] - Additional attributes for the input element.
 * @property {Object} [validationMessages] - Custom validation messages for the field.
 * @property {string} [help] - Help text for the field.
 * @property {string} [model] - The model key to bind the value.
 * @property {Function} [onInput] - Custom input handler for the field.
 * @property {Function} [onBlur] - Custom blur handler for the field.
 * @property {Function} [onFocus] - Custom focus handler for the field.
 */

const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class FormModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('form');
  }

}