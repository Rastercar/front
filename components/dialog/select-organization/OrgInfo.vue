<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi'
import { Organization } from '~/api/types'

defineProps({
  org: { type: Object as PropType<Organization>, required: true },
})

const emit = defineEmits<{
  (event: 'click:go-back'): void
  (event: 'click:access-dashboard'): void
}>()
</script>

<template>
  <div>
    <v-container class="pa-4">
      <v-row>
        <v-col>
          <div class="text-grey-darken-2 text">organization:</div>
          <div class="text-h5">{{ org.name }}</div>
          <div>
            {{ org.billingEmail }}

            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  :icon="
                    org.billingEmailVerified ? 'fa fa-check' : 'fa fa-close'
                  "
                  :color="org.billingEmailVerified ? 'green' : 'grey'"
                  size="sm"
                />
              </template>
              {{
                org.billingEmailVerified
                  ? 'Email Verified'
                  : 'Email not verified'
              }}
            </v-tooltip>
          </div>
          <div>
            <span class="text-grey-darken-2">created at: </span>
            {{ new Date(org.createdAt).toLocaleDateString() }}
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        variant="flat"
        color="blue-darken-2"
        @click="() => emit('click:go-back')"
      >
        <v-icon icon="fa fa-arrow-left" />
      </v-btn>

      <v-spacer />

      <v-btn
        variant="flat"
        color="green-darken-2"
        class="pr-2 pl-3"
        @click="() => emit('click:access-dashboard')"
      >
        access client dashboard
      </v-btn>
    </v-card-actions>
  </div>
</template>
