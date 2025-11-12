// models/FlowNode.js
import mongoose from 'mongoose';

const metadataSchema = new mongoose.Schema(
		{
			positionX: {type: Number, default: 0}, // Para representación visual en editor
			positionY: {type: Number, default: 0},
			color: String,
			tags: [String]
		}
)

const messageSchema = new mongoose.Schema(
		{
			text: {type: String, default: 'Hola'},
			media_url: String,
			media_type: {
				type: String,
				enum: ['image', 'document', 'video', 'audio']
			},
			template_name: String, // Para mensajes de plantilla de WhatsApp
			header: {type: String, default: ''},
			footer: {type: String, default: ''}
		}
)

const optionSchema = new mongoose.Schema({
	text: {type: String, required: true},
	description: String,
	nextNodeId: {type: String, required: false},
	button_type: {
		type: String,
		enum: ['reply', 'url', 'phone'],
		default: 'reply'
	},
	url: String,
	phone_number: String,
})

const flowNodeSchema = new mongoose.Schema(
		{
			chatbotId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chatbot',
				required: [true, 'Account ID es requerido'],
				index: true
			},
			/*node_id: {
				type: String,
				required: [true, 'Node ID es requerido'],
				trim: true
			},*/
			nodeType: {
				type: String,
				enum: ['start', 'message', 'question', 'condition', 'action', 'end'],
				required: [true, 'Tipo de nodo es requerido'],
				default: 'message'
			},
			name: {
				type: String,
				required: true,
				trim: true
			},
			description: {
				type: String,
				trim: true
			}, // Contenido del mensaje que se envía al usuario
			message: {
				type: messageSchema,
				default: () => ({})
			}, // Opciones que se presentan al usuario (botones
			// interactivos)
			options: [optionSchema], // Para matching de respuestas abiertas (sin botones)
			patterns: [{
				pattern: String, // Regex o texto exacto
				match_type: {
					type: String, enum: ['exact', 'contains', 'regex'], default: 'contains'
				}, case_sensitive: {
					type: Boolean, default: false
				}, next_node_id: String
			}], // Nodo al que se dirige si no hay match (fallback)
			fallbackNodeId: {
				type: String, default: null
			}, // Para nodos de tipo 'action' (ejecutar lógica personalizada)
			action: {
				type: {
					type: String,
					enum: ['save_data', 'api_call', 'transfer_agent', 'set_variable', 'send_email'],
				}, config: mongoose.Schema.Types.Mixed // Configuración flexible según el tipo de acción
			}, // Condiciones para nodos condicionales
			conditions: [{
				variable: String, // Nombre de la variable a evaluar
				operator: {
					type: String,
					enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists']
				}, value: mongoose.Schema.Types.Mixed, next_node_id: String
			}], // Variables que se guardan en este nodo
			variablesToSave: [{
				variable_name: String, source: {
					type: String, enum: ['user_input', 'static', 'computed']
				}, value: mongoose.Schema.Types.Mixed
			}], // Tiempo de espera antes de enviar el siguiente mensaje (ms)
			delayMs: {
				type: Number, default: 0, min: 0
			}, // Si es un nodo inicial (entrada al flujo)
			isStart: {
				type: Boolean, default: false, index: true
			}, // Si el nodo está activo
			isActive: {
				type: Boolean, default: true
			}, // Orden de prioridad para evaluación
			priority: {
				type: Number, default: 0
			}, // Metadata adicional
			metadata: {
				type: metadataSchema,
				default: () => ({})
			}
		}, {
			methods: {
				getNextNode: async function (userResponse) {
					// Si hay opciones (botones), buscar coincidencia
					if (this.options && this.options.length > 0) {
						const matchedOption = this.options.find(opt => opt.option_id === userResponse || opt.text.toLowerCase() === userResponse.toLowerCase());

						if (matchedOption) {
							return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, matchedOption.next_node_id);
						}
					}

					// Si hay patrones, intentar match
					if (this.patterns && this.patterns.length > 0) {
						for (const pattern of this.patterns) {
							let isMatch = false;
							const response = pattern.case_sensitive ? userResponse : userResponse.toLowerCase();
							const patternText = pattern.case_sensitive ? pattern.pattern : pattern.pattern.toLowerCase();

							switch (pattern.match_type) {
								case 'exact':
									isMatch = response === patternText;
									break;
								case 'contains':
									isMatch = response.includes(patternText);
									break;
								case 'regex':
									isMatch = new RegExp(patternText).test(response);
									break;
							}

							if (isMatch && pattern.next_node_id) {
								return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, pattern.next_node_id);
							}
						}
					}

					// Fallback
					if (this.fallback_node_id) {
						return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, this.fallback_node_id);
					}

					return null;
				},
				validateFlow: async function () {
					const errors = [];

					// Validar opciones
					if (this.options) {
						for (const option of this.options) {
							const nextNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, option.next_node_id);
							if (!nextNode) {
								errors.push(`Opción "${option.text}" apunta a nodo inexistente: ${option.next_node_id}`);
							}
						}
					}

					// Validar patterns
					if (this.patterns) {
						for (const pattern of this.patterns) {
							if (pattern.next_node_id) {
								const nextNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, pattern.next_node_id);
								if (!nextNode) {
									errors.push(`Pattern "${pattern.pattern}" apunta a nodo inexistente: ${pattern.next_node_id}`);
								}
							}
						}
					}

					// Validar fallback
					if (this.fallback_node_id) {
						const fallbackNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, this.fallback_node_id);
						if (!fallbackNode) {
							errors.push(`Fallback apunta a nodo inexistente: ${this.fallback_node_id}`);
						}
					}

					return {
						valid: errors.length === 0, errors
					};
				}
			},
			statics: {
				findStartNode: function (chatbotId) {
					return this.findOne({
						chatbotId: chatbotId, is_start: true, //is_active: true
					});
				},
				findByChatbotId: function (chatbotId) {
					return this.find({chatbotId})
							.then(nodes => {
								// console.log('nodes', nodes)
								if (nodes && nodes.length) return nodes;

								return this.create({
									chatbotId: chatbotId,
									name: 'Saludo',
									nodeType: 'start'
								})
										.then(node => [node])
										.catch(err => console.error('Error al crear nodo inicial:', err));
							})
							.catch(err => console.error('Error al obtener nodos:', err));
				},
				findByNodeId: function (chatbotId, nodeId) {
					return this.findOne({
						chatbotId: chatbotId,
						_id: nodeId,
						//is_active: true
					});
				}
			},
			timestamps: true
		}
);

// Índices compuestos
flowNodeSchema.index({chatbotId: 1, name: 1}, {unique: true});
flowNodeSchema.index({chatbotId: 1, isStart: 1}, {
	unique: true,
	partialFilterExpression: {isStart: true}
});
// flowNodeSchema.index({chatbotId: 1, isActive: 1});

// Static method for getting the starting node of a flow
/*
flowNodeSchema.statics.findStartNode = function (chatbotId) {
	return this.findOne({
		chatbotId: chatbotId, is_start: true, //is_active: true
	});
};
*/

/*
flowNodeSchema.statics.findByChatbotId = function (chatbotId) {
	return this.find({chatbotId})
			.then(nodes => {
				// console.log('nodes', nodes)
				if (nodes && nodes.length) return nodes;

				return this.create({
					chatbotId: chatbotId,
					name: 'Saludo',
					nodeType: 'start',
					metadata: {
						positionX: 0,
						positionY: 0,
					}
				})
						.then(node => [node])
						.catch(err => console.error('Error al crear nodo inicial:', err));
			})
			.catch(err => console.error('Error al obtener nodos:', err));
};
*/

// Metodo estático para obtener nodo por node_id
/*
flowNodeSchema.statics.findByNodeId = function (chatbotId, nodeId) {
	return this.findOne({
		chatbotId: chatbotId,
		_id: nodeId,
		//is_active: true
	});
};
*/

// Metodo de instancia para obtener el siguiente nodo basado en la respuesta
/*flowNodeSchema.methods.getNextNode = async function (userResponse) {
	// Si hay opciones (botones), buscar coincidencia
	if (this.options && this.options.length > 0) {
		const matchedOption = this.options.find(opt => opt.option_id === userResponse || opt.text.toLowerCase() === userResponse.toLowerCase());

		if (matchedOption) {
			return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, matchedOption.next_node_id);
		}
	}

	// Si hay patrones, intentar match
	if (this.patterns && this.patterns.length > 0) {
		for (const pattern of this.patterns) {
			let isMatch = false;
			const response = pattern.case_sensitive ? userResponse : userResponse.toLowerCase();
			const patternText = pattern.case_sensitive ? pattern.pattern : pattern.pattern.toLowerCase();

			switch (pattern.match_type) {
				case 'exact':
					isMatch = response === patternText;
					break;
				case 'contains':
					isMatch = response.includes(patternText);
					break;
				case 'regex':
					isMatch = new RegExp(patternText).test(response);
					break;
			}

			if (isMatch && pattern.next_node_id) {
				return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, pattern.next_node_id);
			}
		}
	}

	// Fallback
	if (this.fallback_node_id) {
		return await mongoose.model('FlowNode').findByNodeId(this.chatbotId, this.fallback_node_id);
	}

	return null;
};*/

// Metodo para validar que el flujo es válido (no hay referencias rotas)
/*
flowNodeSchema.methods.validateFlow = async function () {
	const errors = [];

	// Validar opciones
	if (this.options) {
		for (const option of this.options) {
			const nextNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, option.next_node_id);
			if (!nextNode) {
				errors.push(`Opción "${option.text}" apunta a nodo inexistente: ${option.next_node_id}`);
			}
		}
	}

	// Validar patterns
	if (this.patterns) {
		for (const pattern of this.patterns) {
			if (pattern.next_node_id) {
				const nextNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, pattern.next_node_id);
				if (!nextNode) {
					errors.push(`Pattern "${pattern.pattern}" apunta a nodo inexistente: ${pattern.next_node_id}`);
				}
			}
		}
	}

	// Validar fallback
	if (this.fallback_node_id) {
		const fallbackNode = await mongoose.model('FlowNode').findByNodeId(this.chatbotId, this.fallback_node_id);
		if (!fallbackNode) {
			errors.push(`Fallback apunta a nodo inexistente: ${this.fallback_node_id}`);
		}
	}

	return {
		valid: errors.length === 0, errors
	};
};
*/

export const FlowNode = mongoose.model('FlowNode', flowNodeSchema);
