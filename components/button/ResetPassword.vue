<script setup lang="ts">
import { SendEmailResponse } from '~~/api/auth'

const props = defineProps({
  /**
   * The email address to send the forgot password email, if falsy
   * will attempt to send it to the email address of the current
   * logged user
   *
   * If a email address is not supplied and theres no logged
   * in user the button will stay disabled as there is nowhere to send
   * the email to
   */
  emailAddress: {
    type: String,
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * The maximum amount of time the user can click on this
   * button to request a forgot password email to be sent
   */
  maxEmailRequests: {
    type: Number,
    default: 2,
  },

  /**
   * The label for when the reset password email was not sent
   */
  initialLabel: {
    type: String,
    default: 'forgot your password ?',
  },
})

const emit = defineEmits<{
  // a reset password email was successfully requested,
  // this does NOT mean the email arrived at the recipient inbox
  (e: 'reset-password-email-sending:sent', emailUuid: string): void

  // a reset password email request was sent but the server returned an error
  (e: 'reset-password-email-sending:failure'): void
}>()

const timesEmailWasSent = ref(0)
const loading = ref(false)

const authStore = useAuthStore()

const requestEmail = () => {
  const email = props.emailAddress || authStore.user?.email

  if (!email || timesEmailWasSent.value >= props.maxEmailRequests) {
    return
  }

  loading.value = true

  sendEmail(email)
    .then(() => timesEmailWasSent.value++)
    .catch(() => emit('reset-password-email-sending:failure'))
    .finally(() => (loading.value = false))
}

const label = computed(() =>
  timesEmailWasSent.value === 0
    ? props.initialLabel
    : timesEmailWasSent.value > 1
    ? 'recover password email resent'
    : 'recover password email sent'
)

const sendEmail = async (email: string) => {
  const { data, execute } = useApi<SendEmailResponse>(
    `auth/send-forgot-password-email`,
    {
      method: 'POST',
      body: { email },
      immediate: false,
    }
  )

  execute().then(() => {
    if (data.value === null) return

    const { emailUuid } = data.value
    emit('reset-password-email-sending:sent', emailUuid)
  })
}
</script>

<template>
  <v-btn
    :loading="loading"
    :disabled="disabled || (!authStore.user?.email && !emailAddress)"
    class="text-none mb-4 w-100"
    :color="
      timesEmailWasSent >= maxEmailRequests
        ? 'grey'
        : timesEmailWasSent === 0
        ? 'indigo-darken-3'
        : 'green'
    "
    size="large"
    @click="requestEmail"
  >
    {{ label }}
  </v-btn>
</template>
