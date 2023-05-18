<script setup lang="ts">
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

interface SideBarRoute {
  to: string
  icon: string
  title: string
}

const routes: SideBarRoute[] = [
  { icon: 'fa fa-home', title: 'Home', to: '/tracked' },
  { icon: 'fa fa-user', title: 'My Profile', to: '/account/profile' },
  { icon: 'fa fa-users', title: 'Users', to: '/tracked/users' },
  { icon: 'fa fa-globe', title: 'Map', to: '/tracked/map' },
]
</script>

<template>
  <v-navigation-drawer
    v-model="layoutStore.drawer.open"
    :rail="layoutStore.drawer.mini"
    permanent
    @click="layoutStore.drawer.mini = false"
  >
    <v-list-item :title="authStore.user?.username" nav class="py-3">
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="fa fa-chevron-left"
          size="small"
          @click.stop="layoutStore.drawer.mini = !layoutStore.drawer.mini"
        />
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="route in routes"
        :prepend-icon="route.icon"
        :title="route.title"
        :value="route.title"
        :to="route.to"
      />
    </v-list>
  </v-navigation-drawer>
</template>
