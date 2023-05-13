<script setup lang="ts">
import {
  clientSideNotifications,
  useNotificationsStore,
} from '~~/store/notifications.store'

type NotificationComponentMap = Record<clientSideNotifications, maybeComponent>

const nStore = useNotificationsStore()

const firstFiveNotifications = computed(() => nStore.notifications.slice(0, 5))

type maybeComponent = ReturnType<typeof resolveComponent>

const notificationComponents: NotificationComponentMap = {
  emailVerificationRequired: resolveComponent('NotificationEmailNotVerified'),
}
</script>

<template>
  <client-only>
    <v-btn class="mr-2">
      <v-menu
        activator="parent"
        :close-on-content-click="false"
        max-width="300px"
      >
        <v-list>
          <template v-for="(notification, i) in firstFiveNotifications">
            <template v-if="notification.content">
              <v-list-item :key="i">
                <template v-slot:prepend>
                  <v-icon :icon="notification.content.icon" class="mr-4" />
                </template>

                <v-list-item-title>
                  {{ notification.content.title }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ notification.content?.message }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <template v-else>
              <component
                :is="notificationComponents[notification.type as clientSideNotifications]"
              ></component>
            </template>
          </template>

          <v-list-item>
            <v-list-item-title> too much notifications </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-badge v-show="nStore.hasPendingNotification" dot color="red">
        <v-icon icon="fa fa-bell" />
      </v-badge>

      <v-icon v-show="!nStore.hasPendingNotification" icon="fa fa-bell" />
    </v-btn>
  </client-only>
</template>
