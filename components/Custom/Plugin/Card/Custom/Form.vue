<template lang="pug">
.custom-plugin-card-attack-form
  EditorToolSlot(label="Base", closable)
    EditorInputTextfield(label="Label", v-model="value.label")
    EditorInputSelect.std-margin(v-model="value.type", label="Type", :options="{ combat: 'Nahkampf', range: 'Fernkampf', magic: 'Magic', shield: 'Rüstung', weapon: 'Waffe' }")
    EditorInputTextarea.std-margin(v-model="value.text", label="Text", :rows="5")
    EditorInputTextarea.std-margin(v-model="value.description", label="Description", :rows="5")
    CustomCardViewIcons
  EditorToolSlot(label="Kosten", closable)
    EditorInputMultiCheckbox.std-margin(v-model="value.cost", :options="costoptions", size="150px")
  EditorToolSlot(label="Nummer 1", closable)
    EditorInputTextfield(label="Nummer", v-model="value.first")
    EditorInputMultiCheckbox.std-margin(v-model="value.firstoptions", :options="firstoptions", size="150px")
  EditorToolSlot(label="Nummer 2", closable)
    EditorInputTextfield(label="Nummer", v-model="value.second")
    EditorInputMultiCheckbox.std-margin(v-model="value.secondoptions", :options="secondoptions", size="150px")
</template>

<script>
export default {

  props: ['value'],

  data() {
    return {
      costoptions: {
        blood: 'Blut',
        rift: 'Rift',
        prepare: 'Prepare',
        plant: 'Pflanze',
        fire: 'Feuer',
        onetime: 'One time',
        perm: 'Permanent',
        light: 'Leicht',
        ki: 'KI',
        free: 'Frei',
        bonus: 'Bonus',
        braue: 'Braue',
      },
      firstoptions: { 
        min: 'Min', 
        max: 'Max',
        even: 'Gerade',
        odd: 'Ungerade',
        ritual: 'Ritual',
      },
      secondoptions: {
        min: 'Min', 
        max: 'Max',
        even: 'Gerade',
        odd: 'Ungerade',
        optional: 'Optional',
        add: 'Plus',
        equal: 'Gleich',
        different: 'Ungleich',
      },
    };
  },

}
</script>