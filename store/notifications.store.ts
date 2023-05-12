import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

/**
 * - 5 highest: will appear on top of notifications list
 * - 4 high: should have a visual indicator indicating its high importance
 * - 3 normal
 * - 2 low: should have a visual indicator indicating its low importance
 * - 1 lowest: will appear at the bottom of notifications list
 */
type priority = 5 | 4 | 3 | 2 | 1

interface NotificationContent {
  /**
   * eg: fa fa-warning
   */
  icon: string

  title: string

  message?: string
}

interface Notification {
  /**
   * UUID for the notification
   */
  id: string

  priority: priority

  /**
   * when this notification was issued
   */
  date: Date

  /**
   * eg: `auth:passwordRecovered`, `post:32:liked`
   */
  type: string

  /**
   * the content of the notification to display, if undefined
   * it is probably deduced from the `type` property
   */
  content?: NotificationContent

  /**
   * If the notification was created by client side JS and
   * not fetched from the rastercar api.
   */
  isClientSide: boolean
}

interface AddClientSideNotificationPayload {
  id?: string
  priority: priority
  type: clientSideNotifications
}

interface NotificationsState {
  // list of notifications to present to the user, ordered by date
  notifications: Notification[]
}

export const useNotificationsStore = defineStore('notifications', {
  persist: true,

  state: (): NotificationsState => ({ notifications: [] }),

  getters: {
    hasPendingNotification: (state) => state.notifications.length > 0,
    pendingNotificationsCount: (state) => state.notifications.length,
  },

  actions: {
    removeById(id: string) {
      const idx = this.notifications.findIndex((n) => n.id === id)
      if (idx === -1) return

      this.notifications.splice(idx, 1)
    },

    removeByType(type: string) {
      this.notifications = this.notifications.filter((n) => n.type !== type)
    },

    addNotification(notification: Notification) {
      let insertionIdx = 0

      const nTime = notification.date.getTime()

      for (let i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].priority > notification.priority) continue
        if (this.notifications[i].date.getTime() < nTime) continue

        insertionIdx = i
        break
      }

      this.notifications.splice(insertionIdx, 0, notification)
    },

    addClientSideNotification(payload: AddClientSideNotificationPayload) {
      const { id, type, priority } = payload

      this.addNotification({
        id: id ?? uuid(),
        date: new Date(),
        type,
        priority,
        isClientSide: true,
      })
    },
  },
})

export type clientSideNotifications = 'emailVerificationRequired'
