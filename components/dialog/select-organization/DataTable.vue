<script setup lang="ts">
import { VDataTableServer } from 'vuetify/lib/labs/components'
import { Organization, Paginated } from '@/api/types'

interface DataTableOptions {
  page: number
  itemsPerPage: number
}

const props = defineProps({
  search: {
    type: String,
    default: '',
  },
})

const emit =
  defineEmits<(event: 'organization:clicked', org: Organization) => void>()

const headers: VDataTableServer['headers'] = [
  { title: 'Name', align: 'start', key: 'name', sortable: false },
  { title: 'Email', align: 'start', key: 'billingEmail', sortable: false },
]

const itemsPerPageOptions = [5, 10, 25, 50].map((n) => ({
  title: `${n}`,
  value: n,
}))

const query = ref({
  limit: itemsPerPageOptions[1].value,
  offset: 0,
  search: props.search,
})

const { data, pending } = useApi<Paginated<Organization>>('/organization', {
  query,
})

watchDebounced(
  () => props.search,
  (search) => (query.value.search = search),
  { debounce: 500 }
)

const loadItems = ({ page, itemsPerPage }: DataTableOptions) => {
  query.value = {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
    search: props.search,
  }
}

const onRowClick = (_: Event, { item }: { item: { raw: Organization } }) => {
  emit('organization:clicked', item.raw)
}
</script>

<template>
  <v-data-table-server
    :headers="headers"
    :items="data?.records"
    :items-length="data?.metadata.total ?? 0"
    :loading="pending"
    :items-per-page-options="itemsPerPageOptions"
    v-model:items-per-page="query.limit"
    item-value="name"
    @update:options="loadItems"
    @click:row="onRowClick"
  />
</template>
