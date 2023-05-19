<script setup lang="ts">
import { email, helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  /**
   * Indicates that the search for a user with the current
   * email address in the modelValue prop failed
   */
  userWithEmailNotFound: {
    type: Boolean,
    default: false,
  },
})

const { withMessage } = helpers

const rules = {
  modelValue: {
    required,
    email,
    isNotMarkedAsNotFound: withMessage(
      'Email not found',
      () => !props.userWithEmailNotFound
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
    variant="outlined"
    required
    prepend-inner-icon="fa fa-envelope"
    type="email"
    label="Email"
  />
</template>
