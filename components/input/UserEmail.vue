<script setup lang="ts">
import { helpers, email, required } from '@vuelidate/validators'
import { computed, PropType, ref, Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },

  /**
   * If this component should consider emails that are in use as valid or the contrary
   */
  validIf: {
    type: String as PropType<'email-in-use' | 'email-not-in-use'>,
    default: 'email-not-in-use',
  },

  /**
   * Notifies the field value will be checked for validity and the input
   * can be invalid after this, therefore a form should cannot be submited
   * while this is true.
   */
  willCheckEmail: {
    type: Boolean,
    default: false,
  },

  /**
   * If were waiting for a request to check for the email on the input
   * to be valid
   */
  isCheckingEmail: {
    type: Boolean,
    default: false,
  },

  /**
   * List of emails that are in use by another user, master user or organization
   */
  emailsInUse: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  /**
   * List of emails that will not trigger the emailInUse error regardless
   * if theyre in use or not.
   *
   * example: The original email of the user, master user or organization
   * being edited
   */
  allowedEmails: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  /**
   * The loading state for the button
   *
   * **NOTE:** Loading will always be true if the component is checking if a email is in use
   */
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:willCheckEmail',
  'update:isCheckingEmail',
])

const internalEmailsInUse = ref<string[]>([])

const rules = computed(() => {
  const validIfInUse = props.validIf === 'email-in-use'

  const validIfNotInUseFn = (v: string) => {
    if (props.allowedEmails.includes(v)) return true
    return (
      !props.emailsInUse.includes(v) && !internalEmailsInUse.value.includes(v)
    )
  }

  const validIfInUseFn = (v: string) => {
    // If we are still checking we cant consider the email as invalid
    // we rely on the component parent to disallow the form to be submitted
    // in the meantime
    if (props.isCheckingEmail || props.willCheckEmail) return true

    return (
      props.emailsInUse.includes(v) || internalEmailsInUse.value.includes(v)
    )
  }

  const usageIsValid = validIfInUse
    ? helpers.withMessage('User with email not found', validIfInUseFn)
    : helpers.withMessage('Email already in use', validIfNotInUseFn)

  return { modelValue: { required, email, usageIsValid } }
})

const vuelidate = useVuelidate(rules, props, { $autoDirty: true })

const checkEmailInUse = () => {
  const email = props.modelValue

  const { data, execute } = useApi<{ inUse: boolean }>(
    `auth/email/${email}/in-use`,
    { immediate: false }
  )

  const isAllowed =
    props.validIf === 'email-not-in-use' && props.allowedEmails.includes(email)

  if (isAllowed || vuelidate.value.modelValue.email.$invalid) return

  emit('update:isCheckingEmail', true)
  emit('update:willCheckEmail', false)

  execute()
    .then(() => {
      if (data.value?.inUse) internalEmailsInUse.value.push(email)
    })
    .finally(() => emit('update:isCheckingEmail', false))
}

const checkEmailUsage = debounce(checkEmailInUse, 500)

const onInput = (v: unknown) => {
  emit('update:modelValue', v)
  emit('update:willCheckEmail', true)
  checkEmailUsage()
}
</script>

<template>
  <v-text-field
    v-bind="({ ...$props, ...$attrs } as any)"
    :error="vuelidate.modelValue.$error"
    :error-messages="getVuelidateErrorMsg(vuelidate.modelValue.$errors)"
    :loading="loading || isCheckingEmail"
    @update:model-value="onInput"
    label="Email *"
    outlined
  />
</template>
