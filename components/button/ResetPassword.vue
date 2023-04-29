<script setup lang="ts">
import { useAuthStore } from '@/store/auth.store'

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

const emit = defineEmits([
  'reset-password-email-sending:sent',
  'reset-password-email-sending:failure',
  'reset-password-email-sending:delivered',
])

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
    .catch(() => {
      emit('reset-password-email-sending:failure')
    })
    .then(() => {
      timesEmailWasSent.value++
      emit('reset-password-email-sending:sent')
    })
    .finally(() => {
      loading.value = false
    })
}

const tooltipText = computed(() => {
  if (loading.value) return 'Sending email...'

  const email = authStore.user?.email

  if (timesEmailWasSent.value === 0) {
    const emailTxt = email ?? 'your email address'
    return `Send a redefine password email to ${emailTxt}`
  }

  const sentTxt = timesEmailWasSent.value === 1 ? 'sent' : 'resent'

  const canSendAgain = timesEmailWasSent.value < props.maxEmailRequests

  const msg = email
    ? `Recover password email ${sentTxt} to ${email}`
    : `Recover password email ${sentTxt} to your email address`

  return canSendAgain ? `${msg}. click to resend` : msg
})

const label = computed(() =>
  timesEmailWasSent.value === 0
    ? props.initialLabel
    : timesEmailWasSent.value > 1
    ? 'recover password email resent'
    : 'recover password email sent'
)

// TODO: a ideia aqui é realizar o envio e escutar atualizações através de websocket
// assim quando um evento do tipo delivery chegar nos podemos emitir um evento para o
// componente pai que substitui o formulario por
// uma mensagem de sucesso (provavelmente um checkmark enorme com "email enviado")
// no lado da api o mailer service provavelmente vai ter um metodo que liga uma escuta
// do rabbitmq e passa isso para o websocket, mas vamos ter que ver como isso vai funcionar no node ?
// (event emmiter ? ????)
const sendEmail = async (email: string) => {
  const { data, execute } = useApi<string>(`auth/send-forgot-password-email`, {
    method: 'POST',
    body: { email },
    immediate: false,
  })

  execute().then(() => console.log({ data }))
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
    <v-tooltip activator="parent" location="bottom">
      {{ tooltipText }}
    </v-tooltip>
  </v-btn>
</template>
