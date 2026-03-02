<template lang="pug">
.custom-plugin-card-chem-form
  EditorToolSlot(label="Base", closable)
    EditorInputTextfield(label="Label", v-model="value.label")
    EditorInputSelect.std-margin(v-model="value.type", label="Type", :options="typesoptions")
    EditorInputTextarea.std-margin(v-model="value.text", label="Text", :rows="5")
    CustomCardViewIcons
  EditorToolSlot(label="IO", closable)
    EditorInputSelect.std-margin(v-model="value.top", label="Top", :options="{ input: 'Input', output: 'Output' }")
    EditorInputSelect.std-margin(v-model="value.left", label="Left", :options="{ input: 'Input', output: 'Output' }")
    EditorInputSelect.std-margin(v-model="value.right", label="Right", :options="{ input: 'Input', output: 'Output' }")
    EditorInputSelect.std-margin(v-model="value.bottom", label="Bottom", :options="{ input: 'Input', output: 'Output' }")
</template>

<script>
export default {

  props: ['value'],

  data() {
    return {
      typesoptions: {
        stabil: 'Stabil',
        instabil: 'Instabil',
        reaktiv: 'Reaktiv',
        katalytisch: 'Katalytisch',
        toxin: 'Toxisch',
      },
    };
  },

}
</script>