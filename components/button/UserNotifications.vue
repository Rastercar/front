<script setup lang="ts">
import { useAuthStore } from '~~/store/auth.store'
import {
  clientSideNotifications,
  useNotificationsStore,
} from '~~/store/notifications.store'

type maybeComponent = ReturnType<typeof resolveComponent>
type NotificationComponentMap = Record<clientSideNotifications, maybeComponent>

const nStore = useNotificationsStore()

const maxNotificationsToDisplay = 5

const mostRecentNotifications = computed(() =>
  nStore.notifications.slice(0, maxNotificationsToDisplay)
)

const notificationComponents: NotificationComponentMap = {
  emailVerificationRequired: resolveComponent('NotificationEmailNotVerified'),
}

const authStore = useAuthStore()

if (authStore.user) {
  const type = 'emailVerificationRequired' as const

  const emailNotVerifiedNotification = {
    id: type,
    type,
    priority: 5 as const,
  }

  authStore.user.emailVerified
    ? nStore.removeClientSideByType(type)
    : nStore.addClientSideNotification(emailNotVerifiedNotification)
}
</script>

<template>
  <client-only>
    <v-btn class="mr-2">
      <v-menu
        activator="parent"
        :close-on-content-click="false"
        max-width="300px"
        location="bottom end"
      >
        <v-list>
          <template v-for="(notification, i) in mostRecentNotifications">
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

          <template
            v-if="nStore.pendingNotificationsCount > maxNotificationsToDisplay"
          >
            <v-divider />

            <v-list-item>
              <v-btn
                size="small"
                color="primary"
                class="mt-2"
                append-icon="fa fa-bell"
                block
                @click="() => navigateTo('/notifications')"
              >
                see all your notifications
              </v-btn>
            </v-list-item>
          </template>

          <v-list-item v-if="nStore.pendingNotificationsCount === 0">
            <v-list-item-title>
              All clear
              <v-icon
                icon="fa fa-check"
                color="green"
                size="small"
                class="ml-1 mb-1"
              />
            </v-list-item-title>

            <v-list-item-subtitle>
              you have no notifications
            </v-list-item-subtitle>
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
