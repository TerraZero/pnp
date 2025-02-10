const RemoteSystem = require('zero-system/src/RemoteSystem');

const FormBase = require('../src/FormBase');

module.exports = class TestForm extends FormBase {

  /**
   * @param {import('../Collector/FormCollector')} collector 
   */
  static define(collector) {
    collector.add('test');
  }

  /**
   * @param {import('../src/FormBuilder')} builder 
   */
  build(builder) {
    builder
      .field({
        name: 'title',
        label: 'Title',
      })
      .field({
        name: 'auto',
        label: 'Auto',
        type: 'autocomplete',
        search: {
          handler: async () => {
            return [
              { value: 1, label: 'First' },
              { value: 2, label: 'Second' },
              { value: 3, label: 'Third' },
            ];
          },
        },
      })
      .field({
        type: 'wrapper',
        name: 'layout_test',
        layout: {
          comp: 'LayoutGrid',
          columns: '1fr 1fr 1fr',
          styles: ({ styles }) => {
            styles.gap = 'var(--form-size-gap)';
          },
        },
      }, builder => {
        builder
          .group('a')
          .field({
            name: 'a',
            label: 'A',
          })
          .group('b')
          .field({
            name: 'b',
            label: 'B',
          })
          .group('a')
          .field({
            name: 'aa',
            label: 'AA',
          });
      })
      .field({
        type: 'group',
        label: 'Wrapper Group',
        name: 'wrapper_group',
        repeatable: true,
      }, builder => {
        builder.field({
          type: 'wrapper',
          name: 'layout_test',
          layout: {
            comp: 'LayoutGrid',
            columns: 2,
            styles: ({ styles }) => {
              styles.gap = 'var(--form-size-gap)';
            },
          },
        }, builder => {
          builder
            .group('a')
            .field({
              name: 'a',
              label: 'A',
            })
            .group('b')
            .field({
              name: 'b',
              label: 'B',
            })
            .group('a')
            .field({
              name: 'aa',
              label: 'AA',
            });
        })
      })
      .field({
        name: 'wrapper',
        type: 'wrapper',
        label: 'Wrapper',
        layout: {
          comp: 'LayoutGrid',
          columns: 2,
          styles: ({ styles }) => {
            styles.gap = 'var(--form-size-gap)';
          },
        },
      }, builder => {
        builder
          .field({
            name: 'h',
            label: 'h',
          })
          .field({
            name: 'b',
            label: 'b',
          });
      })
      .field({
        name: 'two',
        type: 'group',
        label: 'Two Col',
        ':grid:keyup@title': () => {
          return this.values?.title ? 2 : 3;
        },
        frame: true,
      }, builder => {
        builder
          .field({
            name: 'first',
            label: 'First',
          })
          .field({
            name: 'check_mult',
            type: 'checkbox',
            options: {
              first: 'First',
              second: 'Second',
              third: 'Third',
            },
          })
          .field({
            name: 'second',
            label: 'Second',
          })
          .field({
            name: 'third',
            label: 'Third',
          })
          .field({
            name: 'fourth',
            label: 'Fourth',
          });
      })
      .field({
        name: 'check',
        type: 'checkbox',
        label: 'Checkbox',
      })
      .field({
        name: 'condition',
        type: 'group',
        label: 'Condition',
        frame: true,
      }, builder => {
        builder
          .field({
            name: 'checker',
            type: 'select',
            options: {
              first: 'First',
              second: 'Second',
              third: 'Third',
            },
          })
          .field({
            name: 'first',
            label: 'First',
            ':hide:change@condition.checker': () => {
              return this.values?.condition[0]?.checker === 'first' ? false : true;
            },
          })
          .field({
            name: 'second',
            label: 'Second',
            ':hide:change@condition.checker': () => {
              return this.values?.condition[0]?.checker === 'second' ? false : true;
            },
          })
          .field({
            name: 'third',
            label: 'Third',
          });
      })
      .field({
        name: 'check_mult',
        type: 'checkbox',
        label: 'Checkbox Mult',
        options: {
          first: 'First',
          second: 'Second',
          third: 'Third',
        },
      })
      .field({
        name: 'radio_mult',
        type: 'radio',
        label: 'Radio Mult',
        options: {
          first: 'First',
          second: 'Second',
          third: 'Third',
        },
      })
      .field({
        name: 'file',
        type: 'file',
        label: 'File',
        validation: 'mime:application/pdf',
      })
      .field({
        name: 'select',
        type: 'select',
        label: 'Select',
        options: {
          first: 'First',
          second: 'Second',
          third: 'Third',
        },
      })
      .field({
        name: 'select_mult',
        type: 'select',
        label: 'Select Mult',
        'option-groups': {
          One: {
            first: 'First',
            second: 'Second',
            third: 'Third',
          },
          Two: {
            first: 'First',
            second: 'Second',
            third: 'Third',
          },
        },
      })
      .field({
        name: 'range',
        type: 'range',
        label: 'Range',
        min: 0,
        max: 100,
      })
      .field({
        name: 'color',
        type: 'color',
        label: 'Color',
      })
      .field({
        name: 'date',
        type: 'date',
        label: 'Date',
      })
      .field({
        name: 'email',
        type: 'email',
        label: 'E-Mail',
      })
      .field({
        name: 'hidden',
        type: 'hidden',
        value: 'test',
      })
      .field({
        name: 'number',
        type: 'number',
        label: 'Number',
        min: 0,
        max: 100,
        frame: true,
      })
      .field({
        name: 'search',
        type: 'search',
        label: 'Search',
      })
      .field({
        name: 'url',
        type: 'url',
        label: 'URL',
      })
      .field({
        name: 'area',
        type: 'textarea',
        label: 'Textarea',
      })
      .field({
        name: 'group',
        type: 'group',
        label: 'Group',
        repeatable: true,
        frame: true,
      }, builder => {
        builder
          .field({
            name: 'title',
            label: 'Title',
          })
          .field({
            name: 'user',
            label: 'User',
          })
          .field({
            type: 'password',
            name: 'pass',
            label: 'Pass',
            frame: true,
          });
      })
      .field({
        type: 'submit',
        name: 'submit',
        label: 'Submit',
      });
    console.log(this._schema);
  }

  async prepare() {
    this.values = {
      title: 'Loaded title',
      condition: [{checker: 'first'}],
      color: '#FFFFFF',
      a: 'test',
    };
  }

  async submit() {
    console.log('submit', this.values);
  }

}