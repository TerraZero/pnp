<template lang="pug">
transition(name="collapse", @enter="onEnter", @after-enter="onAfterEnter", @leave="onLeave", @after-leave="onAfterLeave")
  .content(v-show="visible")
    slot
</template>

<script>
export default {
  
  props: ['visible'],

  methods: {

    onEnter(el) {
      el.style.height = '0';
      el.style.transition = 'height 0.3s ease';
      requestAnimationFrame(() => {
        el.style.height = el.scrollHeight + 'px';
      });
    },

    onAfterEnter(el) {
      el.style.height = '';
    },

    onLeave(el) {
      el.style.height = el.scrollHeight + 'px';
      el.style.transition = 'height 0.3s ease';
      requestAnimationFrame(() => {
        el.style.height = '0';
      });
    },

    onAfterLeave(el) {
      el.style.height = '';
    },
    
  },
}
</script>

<style scoped>
.content {
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}
</style>
