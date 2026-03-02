<template lang="pug">
.entity-zui-unit-actions
  ElButton(type="primary", icon="el-icon-plus", @click="onAdd")
  .entity-zui-unit-actions__action(v-for="action, index in entity.value.actions", :key="action.label + ':' + index")
    .entity-zui-unit-actions__label {{ action.label }}
    ElButtonGroup.entity-zui-unit-actions__controls
      ElButton(icon="el-icon-edit", size="mini", @click="onEdit(index)")
      ElButton(type="danger", icon="el-icon-delete", size="mini", @click="onDelete(index)")
      
</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';

export default {

  inject: ['zui'],

  props: ['entity'],

  created() {
    ComputedUtil.setDeepVueDefault(this.entity, 'value.actions', []);
  },

  data() {
    return {
      select: this.display ?? 'default',
    };
  },

  methods: {

    onAdd() {
      this.entity.value.actions.push({
        label: 'Action',
      });
      this.onEdit(this.entity.value.actions.length - 1);
    },

    onEdit(index) {
      this.zui.inlineEntity('unit_type', 'action', {
        entity: this.entity,
        index,
      }, build => {
        build.frame.title = 'Edit action "{params.entity.label} / {params.entity.value.actions.' + index + '.label}"';
      });
    },

    onDelete(index) {
      this.entity.value.actions.splice(index, 1);
    },

  },

};
</script>

<style lang="sass">
.entity-zui-unit-actions
  display: grid
  grid-template-columns: 1fr
  gap: .5em

  &__action
    display: grid
    grid-template-columns: 1fr max-content
    transition: background .2s
    padding: .2em
    box-sizing: border-box
    align-items: center

    &:hover
      background: rgba(255, 255, 255, .2)
</style>