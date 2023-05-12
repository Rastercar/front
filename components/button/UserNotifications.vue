<script setup lang="ts">
import { useNotificationsStore } from '~~/store/notifications.store'

const notificationStore = useNotificationsStore()
</script>

<template>
  <v-btn
    @click="() => notificationStore.removeByType('emailVerificationRequired')"
  >
    <v-badge v-show="notificationStore.hasPendingNotification" dot color="red">
      <v-icon icon="fa fa-bell" />
    </v-badge>

    <v-icon
      v-show="!notificationStore.hasPendingNotification"
      icon="fa fa-bell"
    />
  </v-btn>
</template>
