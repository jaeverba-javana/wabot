<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Configuración de Chatbot de WhatsApp</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Información del Negocio</v-card-title>
          <v-card-text>
            <v-form ref="businessForm">
              <v-text-field
                v-model="business.name"
                label="Nombre del Negocio"
                required
              ></v-text-field>
              <v-textarea
                v-model="business.description"
                label="Descripción del Negocio"
                hint="Describe brevemente tu negocio"
                rows="3"
              ></v-textarea>
              <v-text-field
                v-model="business.phone"
                label="Número de WhatsApp"
                hint="Formato: +52 1234567890"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Configuración del Chatbot</v-card-title>
          <v-card-text>
            <v-form ref="chatbotForm">
              <v-text-field
                v-model="chatbot.welcomeMessage"
                label="Mensaje de Bienvenida"
                hint="Mensaje que recibirán tus clientes al iniciar la conversación"
                required
              ></v-text-field>
              <v-select
                v-model="chatbot.language"
                :items="languages"
                label="Idioma Principal"
                required
              ></v-select>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Respuestas Predefinidas</span>
            <v-btn color="primary" @click="addResponse">
              <v-icon left>mdi-plus</v-icon> Agregar Respuesta
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-expansion-panels v-model="openPanel">
              <v-expansion-panel
                v-for="(response, index) in predefinedResponses"
                :key="index"
              >
                <v-expansion-panel-title>
                  {{ response.keyword || 'Nueva Respuesta' }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="response.keyword"
                        label="Palabra Clave"
                        hint="Palabra o frase que activará esta respuesta"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="response.type"
                        :items="responseTypes"
                        label="Tipo de Respuesta"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="response.content"
                        label="Contenido de la Respuesta"
                        hint="Mensaje que se enviará cuando se detecte la palabra clave"
                        rows="3"
                        required
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn
                        color="error"
                        variant="text"
                        @click="removeResponse(index)"
                      >
                        <v-icon left>mdi-delete</v-icon> Eliminar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="primary"
          size="large"
          @click="saveChatbot"
          :loading="loading"
        >
          Guardar Configuración
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ChatbotView',
  data() {
    return {
      loading: false,
      openPanel: null,
      business: {
        name: '',
        description: '',
        phone: ''
      },
      chatbot: {
        welcomeMessage: '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?',
        language: 'es'
      },
      languages: [
        { text: 'Español', value: 'es' },
        { text: 'Inglés', value: 'en' }
      ],
      responseTypes: [
        { text: 'Texto', value: 'text' },
        { text: 'Imagen', value: 'image' },
        { text: 'Opciones', value: 'options' }
      ],
      predefinedResponses: [
        {
          keyword: 'horario',
          type: 'text',
          content: 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM.'
        },
        {
          keyword: 'ubicación',
          type: 'text',
          content: 'Estamos ubicados en Av. Principal #123, Colonia Centro.'
        }
      ]
    }
  },
  mounted() {
    this.fetchChatbotConfig();
  },
  methods: {
    addResponse() {
      this.predefinedResponses.push({
        keyword: '',
        type: 'text',
        content: ''
      });
      this.openPanel = this.predefinedResponses.length - 1;
    },
    removeResponse(index) {
      this.predefinedResponses.splice(index, 1);
    },
    async fetchChatbotConfig() {
      try {
        const response = await fetch('/api/chatbot');

        if (response.status === 404) {
          // No configuration found, use defaults
          return;
        }

        if (!response.ok) {
          throw new Error('Error al obtener la configuración');
        }

        const data = await response.json();

        // Update the form with the retrieved data
        this.business = data.business;
        this.chatbot = data.chatbot;
        this.predefinedResponses = data.predefinedResponses;
      } catch (error) {
        console.error('Error fetching chatbot config:', error);
        // Could show an error message to the user here
      }
    },
    async saveChatbot() {
      this.loading = true;

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            business: this.business,
            chatbot: this.chatbot,
            predefinedResponses: this.predefinedResponses
          })
        });

        if (!response.ok) {
          throw new Error('Error al guardar la configuración');
        }

        // Show success message
        alert('Configuración guardada correctamente');
      } catch (error) {
        console.error('Error saving chatbot config:', error);
        alert('Error al guardar la configuración: ' + error.message);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
