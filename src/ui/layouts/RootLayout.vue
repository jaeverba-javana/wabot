<script lang="ts">
import {defineComponent} from 'vue'

export default {
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
}
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
					<div class="wrapper">

						<div class="logo">
							<img src="/img/logo/Propuesta 3.png" alt="logo" />
						</div>
					</div>
				</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn to="/doc" color="secondary" variant="text" class="me-2">
					Tutoriales

					<template v-slot:prepend>
						<svg style="height: 24px; fill: currentColor;"
								 xmlns="http://www.w3.org/2000/svg"
								 viewBox="0 0 24 24">
							<path d="M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M11 7.5C9.64 6.9 7.84 6.5 6.5 6.5C5.3 6.5 4.1 6.65 3 7V18.5C4.1 18.15 5.3 18 6.5 18C7.84 18 9.64 18.4 11 19V7.5M13 19C14.36 18.4 16.16 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C16.16 6.5 14.36 6.9 13 7.5V19Z" />
						</svg>
					</template>
				</v-btn>
				<v-divider vertical></v-divider>
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

.v-toolbar-title .wrapper {
	display: flex;
	align-items: center;
	position: relative;

	img {
		height: 60px;
		width: 60px;
		transform: scale(1.7);
	}
}


</style>
