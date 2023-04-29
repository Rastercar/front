<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

const isCheckingEmail = ref(false)
const willCheckEmail = ref(false)

const v = useVuelidate()

const email = ref('')
</script>

<template>
  <v-container fluid fill-height class="ma-0 pa-0 page-container">
    <v-row align="center" justify="center" class="page-content">
      <v-card class="elevation-5 mx-auto" style="max-width: 500px">
        <v-card-title class="mx-1 mt-4">Forgot your password ?</v-card-title>

        <v-card-subtitle class="mx-1">
          Enter your account's email address to receive a reset password link
        </v-card-subtitle>

        <InputUserEmail
          class="mt-4 mx-4 mb-4"
          v-model="email"
          v-model:willCheckEmail="willCheckEmail"
          v-model:isCheckingEmail="isCheckingEmail"
          valid-if="email-in-use"
        />

        <div class="mx-4">
          <ButtonResetPassword
            :email-address="email"
            :disabled="willCheckEmail || isCheckingEmail || v.$invalid"
            initial-label="send reset password email"
            class="text-none mb-4 w-100"
            size="large"
          />
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>
