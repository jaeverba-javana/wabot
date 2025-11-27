<script lang="ts">
import {defineComponent} from 'vue'

import AppBar from "./../components/AppBar.vue"

export default {
  name: "RootLayout",
	components: {AppBar},
	data() {
		return {
			isAuthenticated: false
		}
	},
	mounted() {
		// Check if user is authenticated
		const token = localStorage.getItem('token')

		if (token && this.$route.path === '/') {
			this.isAuthenticated = true
      // Redirect to dashboard if user is authenticated
      this.$router.replace('/console')
    }
  }
}
</script>

<template>
  <v-app>
    <!-- Header/Navigation -->
		<AppBar />

    <v-main>
			<div class="wrapper">
				<RouterView />
			</div>

      <!-- Footer -->
      <v-footer class="bg-primary text-center d-flex flex-column">
<!--        <div>-->
<!--          <v-btn v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']" :key="icon" class="mx-2" icon variant="text" color="white">-->
<!--            <v-icon>{{ icon }}</v-icon>-->
<!--          </v-btn>-->
<!--        </div>-->
        <div class="white--text pt-4 pb-2">
          © {{ new Date().getFullYear() }} — <strong>WhatsApp Chatbot</strong>
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
	display: flex;
	flex-direction: column;
  min-height: 100vh;

	.wrapper {
		flex: 1;
	}

	.v-footer {
		flex: 0 0 auto;
	}
}


</style>
