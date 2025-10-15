<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Configuración de Chatbot de WhatsApp</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="1" md="12">
        <v-card class="mb-4">
          <v-card-title>Información del Negocio</v-card-title>
          <v-card-text>
            <v-form ref="businessForm">
              <!--              <v-text-field
                              v-model="business.name"
                              label="Nombre del Negocio"
                              required
                            ></v-text-field>-->
              <!--              <v-textarea
                              v-model="business.description"
                              label="Descripción del Negocio"
                              hint="Describe brevemente tu negocio"
                              rows="3"
                            ></v-textarea>-->
              <v-text-field
                  v-model="fields.business.email.value.value"
                  disabled
                  label="Correo electr&oacute;nico"
              />
              <v-text-field
                  :disabled="appStore.user.phoneNumber && appStore.user.phoneConfirmed"
                  type="phone"
                  v-model="fields.business.phone.value.value"
                  :error-messages="fields.business.phone.errorMessage.value"
                  label="Número de WhatsApp"
                  :hint="(fields.business.phone.errorMessage.value)? 'No use espacios' : fields.business.phone.value.value? 'Todo bien' : 'No use espacios'"
                  required
              ></v-text-field>

              <template v-if="isOtpActive">

              <v-card color="surface">
                <v-col>

                <span>Confirme el número para poder guardarlo</span>
                <v-otp-input
                    v-model="fields.business.otp.value.value"
                    variant="solo"
                ></v-otp-input>
                <v-col cols="12" class="d-flex justify-end">

                <v-btn variant="outlined" >Enviar código</v-btn>
                  <div style="width: .5rem"></div>
                <v-btn>Confirmar número</v-btn>
                </v-col>
                </v-col>
              </v-card>
              </template>


              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                    color="primary"
                    @click="saveInfo"
                    :loading="loading"
                >
                  Guardar información
                </v-btn>
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="false" cols="12" md="6">
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
              <v-icon left>mdi-plus</v-icon>
              Agregar Respuesta
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
                        <v-icon left>mdi-delete</v-icon>
                        Eliminar
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
  </v-container>
</template>

<script lang="ts">
import {useField} from "vee-validate";
import {useAppStore} from "@/stores/app.store.js";
import {watch} from 'vue'

export default {
  name: 'ChatbotView',
  data() {
    return {
      isOtpActive: false,
      loading: false,
      openPanel: null,
      chatbot: {
        welcomeMessage: '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?',
        language: 'es'
      },
      languages: [
        {text: 'Español', value: 'es'},
        {text: 'Inglés', value: 'en'}
      ],
      responseTypes: [
        {text: 'Texto', value: 'text'},
        {text: 'Imagen', value: 'image'},
        {text: 'Opciones', value: 'options'}
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
  setup() {

    const appStore = useAppStore()

    const business = {
      email: useField('businessEmail'),
      phone: useField("businessPhone", (value: string) => {
        if (!value.length) return "El campo no puede quedar vacío"
        if (/[^\d]/.test(value)) return "Por favor solo incluya números"
        if (value.length !== 10) return "El número debe tener 10 caracteres"

        return true
      }),
      otp: useField("businessPhoneOtp")
    }

    watch(appStore.user, (value, oldValue) => {
      console.log("Ha cambiado")

      business.email.value.value = appStore.user.email
    })
    business.email.value.value = appStore.user.email

    return {
      fields: {business},
      appStore
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
    saveInfo() {
      this.loading = true;

    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
