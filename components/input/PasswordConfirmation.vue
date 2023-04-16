<script setup lang="ts">
import { helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  passwordToMatch: {
    type: String,
    required: true,
  },
})

const rules = {
  modelValue: {
    equalsPassword: helpers.withMessage(
      'Passwords do not match',
      (v: string) => v === props.passwordToMatch
    ),
  },
}

const v = useVuelidate(rules, props, { $autoDirty: true })
</script>

<template>
  <v-text-field
    v-bind="({ ...$props, ...$attrs } as any)"
    :error="v.modelValue.$error"
    :error-messages="getVuelidateErrorMsg(v.modelValue.$errors)"
    :type="!visible ? 'password' : 'text'"
    label="Confirm Password *"
    outlined
  />
</template>
