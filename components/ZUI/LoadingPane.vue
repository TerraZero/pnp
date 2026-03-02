<template lang="pug">
.zui-loading-plane(:class="classes", v-loading="loading")
  slot(v-if="result", :params="params", :result="result")
  slot(v-else, name="empty")
</template>

<script>
export default {

  props: ['params', 'method'],

  watch: {

    params: {
      handler: function() {
        this.update();
      },
      immediate: true,
    },

  },

  data() {
    return {
      result: null,
      loading: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.loading) classes.push('loading');
      return classes.map(v => 'zui-loading-plane--' + v);
    }

  },

  methods: {

    async update(reset = false) {
      this.loading = true;
      if (reset) {
        this.result = null;
      }
      this.result = await this.method(...this.params);
      this.$emit('result', this.result);
      this.loading = false;
    },

  },

}
</script>

<style lang="sass">
.zui-loading-plane
  background: var(--color--background)
  box-shadow: var(--shadow--ui)

  &--loading
    min-height: 4em

  .el-loading-mask
    background: transparent

</style>