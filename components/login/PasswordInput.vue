<script setup lang="ts">
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  /**
   * Indicates that there was a failed attempt to login with the
   * password on the modelValue prop
   */
  isInvalid: {
    type: Boolean,
    default: false,
  },
})

const { withMessage } = helpers

const rules = {
  modelValue: {
    required: required,
    minLength: minLength(5),
    maxLength: maxLength(200),
    isNotMarkedAsNotInvalid: withMessage(
      'Invalid Password',
      () => !props.isInvalid
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
    outlined
    required
    prepend-inner-icon="fa fa-lock"
    type="password"
    label="Password"
  />
</template>
