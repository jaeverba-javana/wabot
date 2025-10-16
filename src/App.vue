<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './ui/components/HelloWorld.vue'
import {useAppStore} from "@/stores/app.store.ts";
import ToastContainer from '@/ui/components/ToastContainer.vue'

const appStore = useAppStore()
</script>

<template>
<!--  <v-app>-->
    <v-layout>
      <router-view/>
      <ToastContainer />
    </v-layout>
<!--  </v-app>-->
</template>

<style scoped>

</style>
