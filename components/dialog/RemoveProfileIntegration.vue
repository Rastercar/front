<script setup lang="ts">
const emit = defineEmits<{
  (event: 'update:model-value', v: boolean): void
}>()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  oauthProviderName: { type: String, required: true },
})

const showWarning = ref(false)

const textInput = ref('')

const confirmation = 'unlink account'

const onRemoveLinkClick = () => {
  if (!showWarning.value) {
    showWarning.value = true
    return
  }

  if (textInput.value === confirmation) {
    // TODO:!
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
        <v-btn class="ml-auto" icon="fa fa-close" size="sm" flat @click="close">
        </v-btn>
      </v-card-title>

      <v-card-text class="text-grey-darken-3 pt-2">
        your rastercar account is linked with your
        {{ oauthProviderName }} account.
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
          v-model="textInput"
          :placeholder="confirmation"
          hide-details
          variant="outlined"
        />
      </div>

      <v-card-actions class="ma-4">
        <v-btn
          color="red"
          variant="flat"
          append-icon="fa fa-warning"
          class="px-4 ml-auto"
          :disabled="showWarning && textInput !== confirmation"
          @click="onRemoveLinkClick"
        >
          remove link
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
