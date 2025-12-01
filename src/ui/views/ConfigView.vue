<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<h1 class="text-h4 mb-4">Configuración de Chatbot de WhatsApp</h1>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="1" md="12">
				<v-card style="position: relative" class="mb-4">
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
									v-model="fields.business.phone.value.value"
									disabled
									label="Numero de teléfono"
							/>

							<template v-if="isOtpActive">

								<v-card color="surface">
									<v-col>

										<span>Confirme el número para poder guardarlo</span>
										<v-otp-input
												v-model="fields.business.otp.value.value"
												variant="solo"
										></v-otp-input>
										<v-col cols="12" class="d-flex justify-end">

											<v-btn variant="outlined">Enviar código</v-btn>
											<div style="width: .5rem"></div>
											<v-btn>Confirmar número</v-btn>
										</v-col>
									</v-col>
								</v-card>
							</template>


						</v-form>
					</v-card-text>
				</v-card>

				<v-card class="mb-4">
					<v-card-title>Configuración del bot</v-card-title>
					<v-card-text>
						<v-form ref="botForm">
							<!--							:disabled="appStore.user.phoneNumber && appStore.user.phoneConfirmed"-->
							<v-text-field
									type="number"
									v-model="fields.chatbot.phoneId.value.value"
									:error-messages="fields.chatbot.phoneId.errorMessages.value"
									label="Identificador de número de teléfono"
									:hint="(fields.chatbot.phoneId.errorMessages.value)?
                  'No use espacios' : fields.chatbot.phoneId.value.value?
                  'Todo bien' : 'No use espacios'"
									required
							></v-text-field>
							<v-text-field
									type="text"
									v-model="fields.chatbot.token.value.value"
									:error-messages="fields.chatbot.token.errorMessages.value"
									label="Token de WhatsApp"
									:hint="(fields.chatbot.token.errorMessages.value)?
									'Todo bien':'Token generado en la app de whatsapp de meta'"
									required
							/>
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

				<v-card style="overflow-y: auto" class="mb-4">
					<v-card-title>Configuración del Webhook</v-card-title>
					<v-card-text>
						<span>Ingrese estos datos en meta para conectar el Webhook</span>
						<v-card class="mt-4 pa-4" variant="outlined">
							<div class="d-flex align-center justify-space-between mb-2">
								<span class="text-subtitle-2">URL del Webhook</span>
								<v-btn size="small" variant="text"
											 @click="copyWebhookUrl">
									<SVGIcon style="width: 24px;color:rojo" type="mdi"
													 :path="icon.copy"/>
									<v-tooltip activator="parent" location="top">Copiar URL
									</v-tooltip>
								</v-btn>
							</div>
							<span class="text-body-2 text-medium-emphasis">{{
									webhookUrl
								}}</span>
						</v-card>
						<v-card class="mt-4 pa-4" variant="outlined">
							<div class="d-flex align-center justify-space-between mb-2">
								<span class="text-subtitle-2">Token Para el Desafio</span>
								<v-btn size="small" variant="text"
											 @click="copyWebhookUrl">
									<SVGIcon style="width: 24px;color:rojo" type="mdi"
													 :path="icon.copy"/>
									<v-tooltip activator="parent" location="top">Copiar URL
									</v-tooltip>
								</v-btn>
							</div>
							<span class="text-body-2 text-medium-emphasis">Js3xis2oCy6Wils5uFK7tGkGDrXaFCVV</span>
						</v-card>
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

		<!--    <v-row>
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
				</v-row>-->
	</v-container>
</template>

<script lang="ts">
import { mdiContentCopy } from '@mdi/js';
import {useField} from "vee-validate";
import {useAppStore} from "@/stores/app.store.js";
import {computed, watch} from 'vue'
import {axiosApi} from "../../utils/axios.ts";
import {useToastStore} from '@/stores/toast.store.ts'
import SVGIcon from "@jamescoyle/vue-icon/lib/svg-icon.vue";

export default {
	name: 'ChatbotView',
	components: {SVGIcon},
	data() {
		return {
			isOtpActive: false,
			loading: false,
			openPanel: null,
		}
	},
	setup() {

		const appStore = useAppStore()

		const webhookUrl = computed(() => `${window.location.origin}/api/wab/webhook`)

		/*const business = {
			email: useField('businessEmail'),
			phone: useField("businessPhone", (value: string) => {
				if (!value || !value.length) return "El campo no puede quedar vacío"
				if (/[^\d]/.test(value)) return "Por favor solo incluya números"
				if (value.length < 11 && value.length > 13) return
				"El número debe tener 10 caracteres"

				return true
			}),
			otp: useField("businessPhoneOtp")
		}*/

		/*const chatbot = {
			// email: useField('businessEmail'),
			phoneId: useField("chatbot.phoneId", (value: string) => {
				if (!value || !value.length) return "El campo no puede quedar vacío"
				if (/[^\d]/.test(value)) return "Por favor solo incluya números"
				if (value.length !== 15) return "El número debe tener 15 caracteres"

				return true
			}),
			token: useField("chatbot.token", (value: string) => {
				if (!value || !value.length) return "El campo no puede quedar vacío"

				return true
			})
		}*/

		const business = {
			email: {
				value: computed({
					get: () => appStore.user.email ?? '',
					set: v => appStore.user.email = v
				})
			},
			phone: {
				value: computed(() => appStore.user.phone ?? '')
			}
		}

		const chatbot = {
			phoneId: {
				value: computed({
					get:() => appStore.chatbot.phoneId ?? '',
					set: v => appStore.chatbot.phoneId = v
				}),
				errorMessages: computed(() => {
					const value = appStore.chatbot.phoneId as string;
					if (!value || !value.length) return ["El campo no puede quedar vacío"]
					if (/[^\d]/.test(value)) return ["Por favor solo incluya números"]
					if (value.length !== 15) return ["El número debe tener 15 caracteres"]

					return []
				}),
			},
			token: {
				value: computed({
					get: () => appStore.chatbot.token ?? '',
					set: v => appStore.chatbot.token = v
				}),
				errorMessages: computed(() => {
					const value = appStore.chatbot.token as string;

					if (!value || !value.length) return ["El campo no puede quedar vacío"]

					return []
				})
			}
		}

		return {
			fields: {business, chatbot},
			appStore,
			icon: {copy: mdiContentCopy},
			webhookUrl
		}
	},
	mounted() {
		// this.fetchChatbotConfig();
	},
	methods: {
		copyWebhookUrl() {
			navigator.clipboard.writeText(this.webhookUrl)
					.then(() => {
					const toast = useToastStore();
					toast.show('URL copiada al portapapeles', 'success');
				})
				.catch(() => {
					const toast = useToastStore();
					toast.show('Error al copiar URL', 'error');
				});
		},
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

			axiosApi.patch('/chatbot', {
				phoneId: this.fields.chatbot.phoneId.value.value,
				token: this.fields.chatbot.token.value.value,
			}).then((r: any) => {
				console.log(r)
				this.loading = false;
				const toast = useToastStore();
				this.appStore.setUser(r.data.data.user)
				this.appStore.setChatbot(r.data.data.chatbot)
				this.fields.business.email.value.value = this.appStore.user.email
				this.fields.business.phone.value.value = this.appStore.user.phone
				toast.show('La información se ha guardado correctamente', 'success')
				// this.isOtpActive = true;
			}).catch((err: any) => {
				console.error(err)
				this.loading = false;
				const toast = useToastStore();
				toast.show('Ocurrió un error al guardar la información', 'error')
			})
		}
	}
}
</script>

<style scoped>
.v-card {
	border-radius: 8px;
}

.v-container {
	height: 100%;
	overflow-y: auto;
}
</style>
