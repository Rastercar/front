<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'
import { toast } from 'vue3-toastify'

const emit = defineEmits<{
  (event: 'update:model-value', v: boolean): void
}>()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  oauthProviderName: { type: String, required: true },
})

const integrationRemoved = ref(false)
const requestOngoing = ref(false)
const showWarning = ref(false)

const confirmationInput = ref('')

const auth = useAuthStore()

const { execute, pending } = useApi<string>('user/remove-google-account', {
  method: 'PATCH',
  immediate: false,
  onResponse({ response }) {
    if (response.status === HTTP_STATUS.OK) {
      showWarning.value = false
      integrationRemoved.value = true

      if (auth.user) auth.user.googleProfileId = undefined
    } else {
      toast.error('failed to unlink your account')
    }
  },
})

const confirmation = 'unlink account'

const onRemoveLinkClick = async () => {
  if (!showWarning.value) {
    showWarning.value = true
    return
  }

  if (confirmationInput.value === confirmation) {
    requestOngoing.value = true
    await execute().finally(() => (requestOngoing.value = false))
  }
}

const close = () => {
  emit('update:model-value', false)

  // wait for the close animation to finish
  setTimeout(() => {
    showWarning.value = false
  }, 300)
}
</script>

<template>
  <v-dialog v-model="props.modelValue" width="auto">
    <v-card max-width="650">
      <v-card-title class="d-flex align-center mx-2 mt-2">
        Profile Info
        <v-btn
          v-show="!integrationRemoved"
          class="ml-auto"
          icon="fa fa-close"
          size="sm"
          flat
          @click="close"
        />
      </v-card-title>

      <v-card-text class="text-grey-darken-3 pt-2">
        <template v-if="integrationRemoved">
          Success, your {{ oauthProviderName }} is no longer linked to your
          rastercar account
        </template>

        <template v-else>
          your rastercar account is linked with your
          {{ oauthProviderName }} account.
        </template>
      </v-card-text>

      <div class="px-6" v-show="showWarning">
        <v-alert density="compact" type="error" variant="outlined" class="mb-4">
          after unlinking your account you will not be able to log in using
          {{ oauthProviderName }}.
          <br />

          <span class="font-weight-black"
            >You will get locked out of your account if you do not remember the
            account email address and password.</span
          >
          <br />
          <br />
          if you are accustomed to logging in using {{ oauthProviderName }} we
          suggest you log out and log in using your email and password before
          doing this.
          <br />
          <br />
          to continue please type
          <span class="bg-grey px-2">{{ confirmation }}</span> bellow
        </v-alert>

        <v-text-field
          v-model="confirmationInput"
          :placeholder="confirmation"
          hide-details
          variant="outlined"
        />
      </div>

      <v-card-actions class="ma-4">
        <v-btn
          v-if="!integrationRemoved"
          color="red"
          variant="flat"
          append-icon="fa fa-warning"
          class="px-4 ml-auto"
          :loading="pending && requestOngoing"
          :disabled="showWarning && confirmationInput !== confirmation"
          @click="onRemoveLinkClick"
        >
          remove link
        </v-btn>

        <v-btn
          v-else
          color="green"
          variant="flat"
          append-icon="fa fa-check"
          class="px-4 ml-auto"
          @click="() => emit('update:model-value', false)"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
