<script setup lang="ts">
import { requiredIf, maxLength, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['update:visible'])

const { withMessage } = helpers

const rules = computed(() => ({
  modelValue: {
    required: requiredIf(props.required),

    minLength: (value: string) => {
      if (!props.required && !value) return true
      return value.length > 5
    },

    maxLength: maxLength(200),

    containsUppercase: withMessage(
      'Must contain a uppercased character',
      (value: string) => {
        if (!props.required && !value) return true
        return /[A-Z]/.test(value ?? '')
      }
    ),

    containsLowercase: withMessage(
      'Must contain a lowercased character',
      (value: string) => {
        if (!props.required && !value) return true
        return /[a-z]/.test(value ?? '')
      }
    ),

    containsNumber: withMessage('Must contain a number', (value: string) => {
      if (!props.required && !value) return true
      return /[0-9]/.test(value ?? '')
    }),

    containsSpecial: withMessage(
      'Must contain a especial character (exemple: #?!@$%^&*-)',
      (value: string) => {
        if (!props.required && !value) return true
        return /[#?!@$%^&*-]/.test(value ?? '')
      }
    ),
  },
}))

const v = useVuelidate(rules, props, { $autoDirty: true })
</script>

<template>
  <v-text-field
    v-bind="({ ...$props, ...$attrs } as any)"
    :error="v.modelValue.$error"
    :error-messages="getVuelidateErrorMsg(v.modelValue.$errors)"
    :type="!visible ? 'password' : 'text'"
    label="Password *"
    outlined
  >
    <template #append-inner>
      <v-icon
        :icon="visible ? 'fa fa-eye' : 'fa fa-eye-slash'"
        class="cursor-pointer"
        @click="$emit('update:visible', !visible)"
      />
    </template>
  </v-text-field>
</template>
