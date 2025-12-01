import mongoose from 'mongoose';
import {ChatbotModel} from "./chatbotModel.js";

const conversationSchema = new mongoose.Schema({
	chatbotId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Chatbot',
		required: [true, 'Chatbot ID es requerido'],
		index: true
	},
	userPhone: {
		type: String,
		required: [true, 'Número del usuario es requerido'],
		trim: true,
		validate: {
			validator: function (v) {
				return /^[1-9]\d{1,14}$/.test(v);
			},
			message: 'Formato de número inválido'
		}
	},
	/*user_name: {
		type: String,
		trim: true,
		default: null
	},*/
	lastMessageAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	lastMessagePreview: {
		type: String,
		maxlength: 200,
		default: ''
	},
	unreadCount: {
		type: Number,
		default: 0,
		min: 0
	},

	// **NUEVO: Estado del flujo de conversación**
	flowState: {
		currentNodeId: {
			type: String,
			default: null,
			index: true
		},
		startedAt: {
			type: Date,
			default: null
		},
		completedAt: {
			type: Date,
			default: null
		},
		isActive: {
			type: Boolean,
			default: false
		},
		// Variables guardadas durante el flujo
		variables: {
			type: Map,
			of: mongoose.Schema.Types.Mixed,
			default: {}
		},
		// Historial de nodos visitados
		nodeHistory: [{
			nodeId: String,
			visitedAt: Date,
			userResponse: String
		}],
		// Contador de intentos fallidos (para fallback)
		failedAttempts: {
			type: Number,
			default: 0
		},
		// Si está esperando respuesta del usuario
		waitingForResponse: {
			type: Boolean,
			default: false
		},
		lastBotMessageAt: {
			type: Date,
			default: null
		}
	},

	metadata: {
		tags: [{
			type: String,
			trim: true
		}],
		assigned_to: String,
		priority: {
			type: String,
			enum: ['low', 'normal', 'high', 'urgent'],
			default: 'normal'
		},
		custom_fields: {
			type: Map,
			of: mongoose.Schema.Types.Mixed
		}
	}
}, {
	timestamps: true,
	virtuals: {
		messages: {
			ref: 'Message',
			localField: '_id',
			foreignField: 'conversationId'
		},
		isActive: {
			get: function () {
				const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
				return (this.lastMessageAt > twelveHoursAgo) && (this.flowState.isActive);
			}
		}
	},
	methods: {
		addNewMessage: function (message) {

		},
		startFlow: async function (startNodeId) {
			this.flowState = {
				currentNodeId: startNodeId,
				startedAt: new Date(),
				isActive: true,
				variables: new Map(),
				nodeHistory: [],
				failedAttempts: 0,
				waitingForResponse: true
			};
			return this.save();
		},
		incrementFailedAttempts: async function () {
			this.flowState.failedAttempts += 1;
			return this.save();
		},
		moveToNode: async function(nodeId, userResponse = null) {
			if (this.flowState.currentNodeId) {
				this.flowState.nodeHistory.push({
					nodeId: this.flowState.currentNodeId,
					visitedAt: new Date(),
					userResponse: userResponse
				});
			}

			this.flowState.currentNodeId = nodeId;
			this.flowState.failedAttempts = 0;
			this.flowState.waitingForResponse = true;

			return this.save();
		},
		completeFlow: async function() {
			this.flowState.isActive = false;
			this.flowState.completedAt = new Date();
			this.flowState.waitingForResponse = false;
			return this.save();
		},
	},
	statics: {
		findByPhoneNumberId: function (chatbot, userPhone) {
			return new Promise((resolve, reject) => {
				this.findOne({chatbotId: chatbot._id, userPhone})
						.then(conversation => {
							resolve(conversation ?? new this({
								chatbotId: chatbot._id,
								userPhone
							}).save());
						})
						.catch(err => reject(err));

			})
		},
	},
});

// Índices compuestos
conversationSchema.index({chatbotId: 1, userPhone: 1}, {unique: true});
// conversationSchema.index({ chatbotId: 1, last_message_at: -1 });
// conversationSchema.index({ chatbotId: 1, status: 1 });
// conversationSchema.index({ 'metadata.tags': 1 });
// conversationSchema.index({ 'flow_state.current_node_id': 1 });
// conversationSchema.index({ 'flow_state.is_active': 1 });

// Virtual para obtener mensajes
/*conversationSchema.virtual('messages', {
	ref: 'Message',
	localField: '_id',
	foreignField: 'conversation_id'
});*/

// **NUEVO: Método para iniciar el flujo**
/*conversationSchema.methods.startFlow = ;*/

// **NUEVO: Método para avanzar al siguiente nodo**
/*conversationSchema.methods.moveToNode = ;*/

// **NUEVO: Método para guardar variable del flujo**
/*conversationSchema.methods.setFlowVariable = async function(key, value) {
	if (!this.flow_state.variables) {
		this.flow_state.variables = new Map();
	}
	this.flow_state.variables.set(key, value);
	return this.save();
};*/

// **NUEVO: Método para obtener variable del flujo**
/*conversationSchema.methods.getFlowVariable = function(key) {
	return this.flow_state.variables?.get(key);
};*/

// **NUEVO: Método para completar el flujo**
/*conversationSchema.methods.completeFlow = ;*/

// **NUEVO: Método para reiniciar el flujo**
/*conversationSchema.methods.resetFlow = async function() {
	this.flow_state = {
		current_node_id: null,
		started_at: null,
		completed_at: null,
		is_active: false,
		variables: new Map(),
		node_history: [],
		failed_attempts: 0,
		waiting_for_response: false
	};
	return this.save();
};*/

// **NUEVO: Método para incrementar intentos fallidos**
/*conversationSchema.methods.incrementFailedAttempts = ;*/

// Método para marcar como leída
/*conversationSchema.methods.markAsRead = async function() {
	this.unread_count = 0;
	return this.save();
};*/

// Método para incrementar mensajes no leídos
/*conversationSchema.methods.incrementUnread = async function() {
	this.unread_count += 1;
	this.last_message_at = new Date();
	return this.save();
};*/

// Método estático para obtener conversaciones activas con populate
/*conversationSchema.statics.findActiveByAccount = function(accountId, limit = 50) {
	return this.find({
		chatbotId: accountId,
		status: 'active'
	})
			.sort({ last_message_at: -1 })
			.limit(limit)
			.populate('chatbotId', 'phone_number business_name');
};*/

export const ConversationModel = mongoose.model('Conversation', conversationSchema);
