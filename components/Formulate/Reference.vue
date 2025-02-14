<template lang="pug">
.formulate-reference.formulate-input-element(:class="classes", :data-type="context.type")
  .formulate-reference__input-wrapper
    input(type="text", v-model="proxy", @input="onInput", v-bind="context.attributes")
    ElButton(@click="onClick")
      span.el-icon-circle-plus-outline
  ElTable(:data="table", size="mini", :show-header="false", empty-text=" ", v-loading="loading")
    ElTableColumn(prop="type", label="Type")
    ElTableColumn(prop="id", label="ID")
    ElTableColumn(prop="name", label="Name")
  ZeroEntitySelectList(ref="dialog", :exclude="[value]", @select="onSelect")
  
</template>

<script>
import ZERO from '~/custom/plugins/zero.plugin';

export default {

  props: {

    context: {
      type: Object,
      required: true,
    },

  },

  watch: {

    model() {
      this.update();
    },

  },

  mounted() {
    this.update();
    this.proxy = this.value;
  },

  data() {
    return {
      loading: false,
      table: [],
      proxy: null,
      _refType: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      classes.push('formulate-input-element--' + this.context.class);
      return classes;
    },

    model() {
      return this.context.model;
    },

    value() {
      return this.model && this.model[0] && this.model[0].id || null;
    },

    propRef() {
      return this.context.slotProps.component.ref ?? null;
    },

    title() {
      return 'Select ' + this.propRef.split('.')[1];
    },

    dialog() {
      return this.$refs.dialog;
    },

  },

  methods: {

    onInput() {
      this.context.model = [{ id: parseInt(this.proxy) }];
    },

    onSelect(select) {
      this.proxy = select.id;
      this.onInput();
      this.dialog.close();
    },

    onClick() {
      this.dialog.open({
        type: this.propRef,
      });
    },

    async getRefType() {
      if (!this._refType && this.propRef) {
        if (this.propRef === 'entity.tile') return null;
        this._refType = await ZERO.get(this.propRef);
      }
      return this._refType;
    },

    async update() {
      this.loading = true;
      if (this.value) {
        const ref = await this.getRefType();
        if (ref === null) return;
        const info = await ref.info();
        const value = await ref.load(this.value);
        if (value) {
          value.type = info.label;
          this.table = [
            value,
          ];
        } else {
          this.table = [];
        }
      }
      this.loading = false;
    },

  },

}
</script>

<style lang="sass">
.formulate-reference
  
  &__input-wrapper
    display: flex

</style>
  