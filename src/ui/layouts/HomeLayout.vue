<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "HomeLayout",
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Chatbot WhatsApp', icon: 'mdi-chat', to: '/chatbot' },
      ],
    }
  }
})
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list-item
        title="WhatsApp Chatbot"
        subtitle="Panel de Control"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          :to="item.to"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="WhatsApp Chatbot" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  min-height: 100dvh;
}
</style>
