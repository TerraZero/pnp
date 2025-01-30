import Vue from 'vue';
import VueFormulate from '@braid/vue-formulate';
import TestField from './TestField';

export default ({ app }, inject) => {
  Vue.use(VueFormulate, {
    plugins: [TestField],
  });
}
