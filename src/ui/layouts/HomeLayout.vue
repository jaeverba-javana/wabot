<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "HomeLayout"
})
</script>

<template>
  <v-app-bar title="Application bar" elevation="8">

  </v-app-bar>

  <v-main>

  </v-main>
</template>

<style scoped>
.v-main {
  min-height: 100dvh;
}
</style>