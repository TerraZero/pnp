import Vue from 'vue';

import TimingUtil from 'zero-util/src/TimingUtil';

Vue.directive('zero', {

  bind(el, definition) {
    const [ action, event = 'input' ] = definition.arg.split(':');

    switch (action) {
      case 'debounce':
        if (typeof definition.value !== 'function') {
          throw new Error(`Please use an anonymous method in ${definition.rawName}="${definition.expression}": () => {}`);
        }
        let original = definition.value;
        if (definition.modifiers.tick) {
          original = (...args) => {
            Vue.nextTick(() => definition.value(...args));
          };
        }
        const debounce = TimingUtil.debounce(original);
        el.addEventListener(event, debounce);
        el._zeroDebounce ??= [];
        el._zeroDebounce.push({ event, fn: debounce });
        break;
    }
  },

  unbind(el) {
    if (el._zeroDebounce) {
      for (const item of el._zeroDebounce) {
        el.removeEventListener(item.event, item.fn);
      }
      delete el._zeroDebounce;
    }
  },

});