import {ConversationModel, FlowNodeModel} from './../db/mongoDb/models/index.js'

class FlowEngine {
	async processIncomingMessage(conversation, message) {
		try {
			console.log('message:', message, 'conversation:', conversation);

			// Obtener el nodo actual
			const currentNode = await FlowNodeModel.findByNodeId(
					conversation.chatbotId,
					conversation.flowState.currentNodeId
			);

			if (!currentNode || conversation.isActive === false) {
				console.error('Nodo actual no encontrado');
				return await this.startFlow(conversation); // Reiniciar flujo
			}

			console.log("Nodo actual:", currentNode)

			// Guardar variables si el nodo lo indica
			if (currentNode.variablesToSave) {
				for (const varConfig of currentNode.variablesToSave) {
					if (varConfig.source === 'user_input') {
						await conversation.setFlowVariable(varConfig.variable_name, message);
					} else if (varConfig.source === 'static') {
						await conversation.setFlowVariable(varConfig.variable_name, varConfig.value);
					}
				}
			}

			// Obtener siguiente nodo basado en la respuesta
			const nextNode = await currentNode.getNextNode(message);

			if (!nextNode) {
				// No hay siguiente nodo, incrementar intentos fallidos
				await conversation.incrementFailedAttempts();

				if (conversation.flowState.failedAttempts >= 3) {
					return {
						shouldSend: true,
						message: {
							text: 'Lo siento, no entendí tu respuesta. Vamos a empezar de nuevo.',
							type: 'text'
						},
						action: 'restart_flow'
					};
				}

				// Enviar mensaje de error y repetir nodo actual
				return {
					shouldSend: true,
					message: {
						text: 'No entendí tu respuesta. Por favor, selecciona una de las opciones disponibles.',
						type: 'text'
					},
					action: 'retry'
				};
			}

			// Mover al siguiente nodo
			await conversation.moveToNode(nextNode.name, message);

			// Ejecutar acciones del nodo
			if (nextNode.action) {
				await this.executeAction(nextNode.action, conversation);
			}

			// Si es un nodo final, completar el flujo
			if (nextNode.nodeType === 'end' || nextNode.options?.length === 0) {
				await conversation.completeFlow();

				return {
					shouldSend: true,
					message: this.buildMessage(nextNode, conversation),
					action: 'end_flow'
				};
			}

			// Enviar mensaje del siguiente nodo
			return {
				shouldSend: true,
				message: this.buildMessage(nextNode, conversation),
				nextNode: nextNode
			};

		} catch (error) {
			console.error('Error procesando flujo:', error);
			throw error;
		}
	}

	/**
	 * Inicia el flujo de conversación
	 */
	async startFlow(conversation) {
		const startNode = await FlowNodeModel.findStartNode(conversation.chatbotId);

		if (!startNode) {
			throw new Error('No se encontró nodo inicial para esta cuenta');
		}

		await conversation.startFlow(startNode.name);

		return {
			shouldSend: true,
			message: this.buildMessage(startNode, conversation),
			nextNode: startNode
		};
	}

	/**
	 * Construye el mensaje a enviar desde un nodo
	 */
	buildMessage(node, conversation) {
		const _message = {
			text: this.replaceVariables(node.message.text, conversation),
		}
		const message = {};

		// Agregar botones interactivos si existen
		if (!node.options || node.options.length === 0) {
			message.type = 'text';
			message.text = {body:_message.text};
		} else if (node.options && node.options.length > 0) {
			// Para WhatsApp Business API con botones de respuesta
			if (node.options.length <= 3) {
				message.type = 'interactive';
				message.interactive = {
					type: 'button',
					body: {
						text: _message.text
					},
					action: {
						buttons: node.options.map(opt => ({
							type: 'reply',
							reply: {
								id: opt._id,
								title: opt.text
							}
						}))
					}
				};
			} else if (node.options.length <= 10) {
				// Para listas (más de 3 opciones)
				message.type = 'interactive';
				message.interactive = {
					type: 'list',
					body: {
						text: _message.text
					},
					action: {
						button: 'Ver opciones',
						sections: [{
							title: 'Opciones',
							rows: node.options.map(opt => ({
								id: opt._id,
								title: opt.text,
								description: opt.description || ''
							}))
						}]
					}
				};
			} else {
				// Demasiadas opciones, enviar como texto numerado
				message.text += '\n\n' + node.options.map((opt, idx) =>
						`${idx + 1}. ${opt.text}`
				).join('\n');
			}
		}

		// Agregar header y footer si existen
		if (node.message.header && message[message.type]) {
			message[message.type].header = {
				type: 'text',
				text: node.message.header
			};
		}
		if (node.message.footer && message[message.type]) {
			message[message.type].footer = {
				text: node.message.footer
			};
		}

		// Agregar media si existe
		if (node.message.media_url && node.message.media_type) {
			message.type = node.message.media_type;
			message[node.message.media_type] = {
				link: node.message.media_url,
				caption: message.text
			};
		}

		return message;
	}

	/**
	 * Reemplaza variables en el texto con valores guardados
	 */
	replaceVariables(text, conversation) {
		if (!text) return '';

		let result = text;

		// Reemplazar variables guardadas: {{variable_name}}
		const variables = conversation.flowState.variables;
		if (variables) {
			variables.forEach((value, key) => {
				result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});
		}

		// Reemplazar variables del sistema
		result = result.replace(/{{user_name}}/g, conversation.username || 'Usuario');
		result = result.replace(/{{user_phone}}/g, conversation.userPhone);

		return result;
	}

	/**
	 * Ejecuta acciones personalizadas de un nodo
	 */
	async executeAction(action, conversation) {
		switch (action.type) {
			case 'save_data':
				// Guardar datos en la conversación
				if (action.config?.data) {
					for (const [key, value] of Object.entries(action.config.data)) {
						await conversation.setFlowVariable(key, value);
					}
				}
				break;

			case 'set_variable':
				if (action.config?.variable && action.config?.value !== undefined) {
					await conversation.setFlowVariable(
							action.config.variable,
							action.config.value
					);
				}
				break;

			case 'transfer_agent':
				// Marcar conversación para transferir a agente humano
				conversation.metadata.custom_fields.set('requires_agent', true);
				conversation.flow_state.is_active = false;
				await conversation.save();
				break;

			case 'api_call':
				// Llamar a API externa (implementar según necesidad)
				console.log('API call action:', action.config);
				break;

			case 'send_email':
				// Enviar email (implementar según necesidad)
				console.log('Send email action:', action.config);
				break;

			default:
				console.warn('Acción desconocida:', action.type);
		}
	}
}

export default new FlowEngine();
