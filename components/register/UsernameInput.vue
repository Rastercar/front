<script setup lang="ts">
import { required, minLength, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const rules = {
  modelValue: { required, minLength: minLength(5), maxLength: maxLength(60) },
}

const v = useVuelidate(rules, props, { $autoDirty: true })
</script>

<template>
  <v-text-field
    v-bind="({ ...$props, ...$attrs } as any)"
    :error="v.modelValue.$error"
    :error-messages="getVuelidateErrorMsg(v.modelValue.$errors)"
    label="Username *"
    outlined
    required
  />
</template>
