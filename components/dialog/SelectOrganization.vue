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

const changeOrgOverlay = ref(false)
</script>

<template>
  <v-dialog v-model="props.modelValue" width="auto">
    <OverlayChangeOrganization v-model="changeOrgOverlay" />

    <v-card max-width="900">
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

        <DataTableOrganization
          :search="search"
          class="mb-2"
          @organization:clicked="onOrganizationSelected"
        />
      </template>

      <template v-else-if="selectedOrg">
        <v-container class="pa-4">
          <v-row>
            <v-col>
              <div class="text-grey-darken-2 text">organization:</div>
              <div class="text-h5">{{ selectedOrg.name }}</div>
              <div>
                {{ selectedOrg.billingEmail }}

                <v-tooltip bottom>
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :icon="
                        selectedOrg.billingEmailVerified
                          ? 'fa fa-check'
                          : 'fa fa-close'
                      "
                      :color="
                        selectedOrg.billingEmailVerified ? 'green' : 'grey'
                      "
                      size="sm"
                    />
                  </template>
                  {{
                    selectedOrg.billingEmailVerified
                      ? 'Email Verified'
                      : 'Email not verified'
                  }}
                </v-tooltip>
              </div>
              <div>
                <span class="text-grey-darken-2">created at: </span>
                {{ new Date(selectedOrg.createdAt).toLocaleDateString() }}
              </div>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions class="px-4 pb-4">
          <v-btn
            variant="flat"
            color="blue-darken-2"
            @click="display = 'data-table'"
          >
            <v-icon icon="fa fa-arrow-left" />
          </v-btn>

          <v-spacer />

          <v-btn variant="flat" color="green-darken-2" class="pr-2 pl-3">
            access client dashboard
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>
