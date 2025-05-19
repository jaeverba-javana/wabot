<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RootLayout",
  data() {
    return {
      // Check if user is authenticated
      isAuthenticated: false,
      // Features list for the landing page
      features: [
        { icon: 'mdi-chat', title: 'Chat bot', description: 'Crea respuestas automáticas para las tareas repetitivas de tu empresa' },
        { icon: 'mdi-account-group', title: 'Soporte 24/7', description: 'Nuestro equipo está disponible todo el día para ayudarte con cualquier consulta.' },
        { icon: 'mdi-cellphone-link', title: 'Multiplataforma', description: 'Accede desde cualquier dispositivo, en cualquier momento y lugar.' }
      ]
    }
  },
  mounted() {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (token) {
      this.isAuthenticated = true
      // Redirect to dashboard if user is authenticated
      this.$router.push('/console')
    }
  }
})
</script>

<template>
  <v-app>
    <!-- Header/Navigation -->
    <v-app-bar color="transparent" elevation="0" app>
      <v-container class="py-0 fill-height">
        <v-avatar class="me-4" color="primary" size="32">
          <v-icon color="white">mdi-chat</v-icon>
        </v-avatar>
        <v-app-bar-title class="text-h6 font-weight-bold">WhatsApp Chatbot</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn to="/auth/login" color="primary" variant="text" class="me-2">Iniciar Sesión</v-btn>
        <v-btn to="/auth/signup" color="primary" variant="outlined">Registrarse</v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container>
          <v-row align="center" justify="center" class="py-16">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <h1 class="text-h2 font-weight-bold mb-4">Bienvenido a Nuestro Chatbot Inteligente</h1>
              <p class="text-h6 mb-8">La solución perfecta para automatizar tus conversaciones de WhatsApp y mejorar la experiencia de tus clientes.</p>
              <v-btn to="/auth/signup" color="primary" size="x-large" class="me-4">Comenzar Ahora</v-btn>
              <v-btn to="/auth/login" color="secondary" size="x-large" variant="outlined">Iniciar Sesión</v-btn>
            </v-col>
            <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
              <v-img src="https://cdn.pixabay.com/photo/2020/05/18/16/17/social-media-5187243_960_720.png" max-width="500" contain></v-img>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Section -->
      <section class="features-section py-16 bg-grey-lighten-4">
        <v-container>
          <h2 class="text-h3 text-center font-weight-bold mb-12">Nuestras Características</h2>
          <v-row>
            <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4">
              <v-card class="mx-auto" height="100%" elevation="0">
                <v-card-item>
                  <v-avatar color="primary" size="64" class="mb-4">
                    <v-icon size="36" color="white">{{ feature.icon }}</v-icon>
                  </v-avatar>
                  <v-card-title class="text-h5 font-weight-bold">{{ feature.title }}</v-card-title>
                  <v-card-text>
                    <p class="text-body-1">{{ feature.description }}</p>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CTA Section -->
      <section class="cta-section py-16">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-card class="text-center pa-8" elevation="10">
                <v-card-title class="text-h4 mb-4">¿Listo para comenzar?</v-card-title>
                <v-card-text>
                  <p class="text-body-1 mb-6">
                    Únete a miles de usuarios que ya están mejorando su comunicación con nuestro chatbot inteligente.
                  </p>
                  <v-row justify="center" class="mt-6">
                    <v-col cols="12" sm="6" class="px-2">
                      <v-btn 
                        block 
                        color="primary" 
                        size="large" 
                        to="/auth/login"
                        class="mb-3"
                      >
                        Iniciar Sesión
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" class="px-2">
                      <v-btn 
                        block 
                        color="secondary" 
                        size="large" 
                        to="/auth/signup"
                        class="mb-3"
                      >
                        Registrarse
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <v-footer class="bg-primary text-center d-flex flex-column">
        <div>
          <v-btn v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']" :key="icon" class="mx-2" icon variant="text" color="white">
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </div>
        <div class="white--text pt-4 pb-2">
          © {{ new Date().getFullYear() }} — <strong>WhatsApp Chatbot</strong>
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
}

.features-section {
  background-color: #f5f5f5;
}

.cta-section {
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  padding: 80px 0;
}

.cta-section .v-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.v-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  color: #333;
  font-weight: bold;
}

.text-md-left {
  text-align: left;
}

@media (max-width: 960px) {
  .text-md-left {
    text-align: center;
  }
}
</style>
