<script setup lang="ts">
const emit = defineEmits<{
  (event: 'update:model-value', v: boolean): void
}>()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  oauthProviderName: { type: String, required: true },
})
</script>

<template>
  <v-dialog v-model="props.modelValue" width="auto">
    <v-card max-width="650">
      <v-card-title class="d-flex align-center mx-2 mt-2">
        Account linking
        <v-btn
          class="ml-auto"
          icon="fa fa-close"
          size="sm"
          flat
          @click="() => emit('update:model-value', false)"
        />
      </v-card-title>

      <v-card-text class="text-grey-darken-3 pt-2">
        Do you wish to associate your {{ oauthProviderName }} with your
        rastercar account ? by doing so you will be able to sign in using
        {{ oauthProviderName }}
      </v-card-text>

      <v-card-actions class="ma-4">
        <LoginGoogleButton color="green" variant="flat" class="px-4 ml-auto">
          associate {{ oauthProviderName }} account
        </LoginGoogleButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
