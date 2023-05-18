<script setup lang="ts">
import { Organization } from '~/api/types'

type displayMode = 'data-table' | 'selected-organization' | 'loading-message'

const emit = defineEmits<{
  (event: 'update:model-value', v: boolean): void
}>()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const search = ref('')
const selectedOrg = ref<Organization | null>(null)

const display = ref<displayMode>('data-table')

const onOrganizationSelected = (org: Organization) => {
  selectedOrg.value = org
  display.value = 'selected-organization'
}

const authStore = useAuthStore()

const accessClientDashboard = () => {
  const org: Organization | null = unref(selectedOrg)

  if (!org) return

  display.value = 'loading-message'

  setTimeout(() => {
    authStore.organization = org
    navigateTo('/tracked')
  }, 2 * 1000)
}
</script>

<template>
  <v-dialog v-model="props.modelValue" width="auto">
    <div class="text-center" v-if="display === 'loading-message'">
      <div class="text-h3 mb-6 font-weight-black">
        accessing client panel...
      </div>
      <div>
        <v-progress-circular color="blue-darken-3" indeterminate size="80" />
      </div>
    </div>

    <v-card max-width="900" v-else>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" icon="fa fa-building" size="sm" />
        select client organization
        <v-icon
          class="mr-1 ml-auto"
          icon="fa fa-close"
          size="sm"
          @click="() => emit('update:model-value', false)"
        />
      </v-card-title>

      <template v-if="display === 'data-table'">
        <v-text-field v-model="search" label="search by name" rounded="0" />

        <DialogSelectOrganizationDataTable
          :search="search"
          class="mb-2"
          @organization:clicked="onOrganizationSelected"
        />
      </template>

      <DialogSelectOrganizationOrgInfo
        v-else-if="selectedOrg"
        :org="selectedOrg"
        @click:go-back="display = 'data-table'"
        @click:access-dashboard="accessClientDashboard"
      />
    </v-card>
  </v-dialog>
</template>
