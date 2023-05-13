<script setup lang="ts">
import { useLayoutStore } from '~~/store/layout.store'

const layoutStore = useLayoutStore()

interface SideBarRoute {
  icon: string
  title: string
}

const routes: SideBarRoute[] = [
  { icon: 'fa fa-home', title: 'Home' },
  { icon: 'fa fa-user', title: 'My Account' },
  { icon: 'fa fa-users', title: 'Users' },
]
</script>

<template>
  <v-navigation-drawer
    v-model="layoutStore.drawer.open"
    :rail="layoutStore.drawer.mini"
    permanent
    @click="layoutStore.drawer.mini = false"
  >
    <!-- TODO: avatar! -->
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/1.jpg"
      title="Vitor Guidorizzi"
      nav
      class="py-3"
    >
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
      />
    </v-list>
  </v-navigation-drawer>
</template>
