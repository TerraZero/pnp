<template lang="pug">
.tests-inlinewindow
  ElButton(@click="onClick") Open
  .tests-inlinewindow
    | {{ value }}
</template>

<script>
export default {

  inject: ['zui'],

  data() {
    return {
      value: 'Default text',
    };
  },

  methods: {

    async onClick() {
      this.zui.inline({
        component: 'Tests/InlineWindowController',
        params: {
          host: this,
        },
        frame: {
          title: 'Control test',
          width: '60%',
          height: '50%',
          position: 'center',
        },
      });
    },

  },

}
</script>