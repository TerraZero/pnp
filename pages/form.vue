<template lang="pug">
.test
  button(@click="onclick") click
  ZeroFormulate(form="form.test")
</template>

<script>
import ZERO from '~/custom/plugins/zero.plugin';

export default {
  methods: {
    async onclick() {
      const forms = await ZERO.get('remote.form');
      const componente = forms.open('form.building.edit', { game: 'paycyber', id: 2 }, ({ result }) => {
        console.log('result', result);
      });
    }
  },
}
</script>