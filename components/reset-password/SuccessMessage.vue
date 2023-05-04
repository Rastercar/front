<template>
  <div>
    <div class="text-h5 mb-6 text-center">
      <v-icon icon="fa fa-check-circle" color="green" size="md" class="mr-2" />
      Password changed successfully!
    </div>

    <div class="mx-8">
      <v-btn
        class="w-100 text-white"
        color="green"
        prepend-icon="fa fa-angle-left"
        @click="() => navigateTo('/')"
      >
        go to login
      </v-btn>
    </div>
  </div>
</template>
