<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RootLayout",
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
})
</script>

<template>
  <v-app>
    <!-- Header/Navigation -->
    <v-app-bar color="transparent" elevation="3" app>
      <v-container class="py-0 fill-height">
<!--        <v-avatar class="me-4" color="primary" size="32">-->
<!--          <v-icon color="white">mdi-chat</v-icon>-->
<!--        </v-avatar>-->
        <v-app-bar-title class="text-h6 font-weight-bold">
					<div style="display: flex; flex-direction: column">
						<div>VANNIA</div>
						<span style="font-size: 11px; margin: 0; margin-top: -10px;
						font-weight: 400">Crea,
							Conecta,
							Conversa</span>
					</div>
				</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn to="/auth/login" color="primary" variant="text" class="me-2">Iniciar Sesión</v-btn>
        <v-btn to="/auth/signup" color="primary" variant="outlined">Registrarse</v-btn>
      </v-container>
    </v-app-bar>

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
