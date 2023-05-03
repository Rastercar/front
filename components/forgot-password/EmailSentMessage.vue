<script setup lang="ts">
defineProps({ emailStatus: { type: String, required: true } })
</script>

<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-center text-grey-darken-5">Success !</h2>

    <div class="text-center my-4">
      <v-icon
        class="mr-4"
        icon="fa fa-envelope"
        size="80px"
        :color="emailStatus !== 'delivered' ? 'grey' : 'green'"
      />

      <v-tooltip
        v-if="emailStatus === 'delivered' || emailStatus === 'sending_finished'"
        :text="
          emailStatus === 'sending_finished'
            ? 'email sent to your inbox'
            : 'email arrived at your inbox'
        "
      >
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            icon="fa fa-check"
            size="40px"
            :color="emailStatus === 'sending_finished' ? 'grey' : 'green'"
          />
        </template>
      </v-tooltip>
    </div>

    <h3 class="text-center text-grey-darken-3">
      follow the instructions on the email we sent you to reset your password
    </h3>

    <v-btn
      class="text-white mt-4"
      color="green"
      variant="text"
      prepend-icon="fa fa-angle-left"
      block
      @click="() => navigateTo('/')"
    >
      go back
    </v-btn>
  </div>
</template>
