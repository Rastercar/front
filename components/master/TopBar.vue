<script setup lang="ts">
const authStore = useAuthStore()

const logout = () => {
  authStore.logOut()
  navigateTo('/')
}

const customerDashboardModalOpen = ref(false)
</script>

<template>
  <v-app-bar>
    <v-app-bar-title>Rastercar Dashboard</v-app-bar-title>

    <template v-slot:append>
      <ButtonUserNotifications class="mr-4" />

      <v-btn
        color="primary"
        class="mr-4"
        prepend-icon="fa fa-bar-chart"
        elevation="0"
        variant="flat"
        @click="customerDashboardModalOpen = true"
      >
        client dashboard
      </v-btn>

      <DialogSelectOrganization v-model="customerDashboardModalOpen" />

      <v-btn
        class="ml-auto mr-2 px-4"
        prepend-icon="fa fa-door-open"
        variant="outlined"
        @click="logout"
      >
        Log out
      </v-btn>
    </template>
  </v-app-bar>
</template>
