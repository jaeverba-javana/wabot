// models/Conversation.js (ACTUALIZADO)
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
	chatbotId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: [true, 'Account ID es requerido'],
		index: true
	},
	userPhone: {
		type: String,
		required: [true, 'Número del usuario es requerido'],
		trim: true,
		validate: {
			validator: function(v) {
				return /^\+[1-9]\d{1,14}$/.test(v);
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
	status: {
		type: String,
		enum: ['active', 'archived', 'blocked'],
		default: 'active'
	},

	// **NUEVO: Estado del flujo de conversación**
	flowState: {
		current_node_id: {
			type: String,
			default: null,
			index: true
		},
		started_at: {
			type: Date,
			default: null
		},
		completed_at: {
			type: Date,
			default: null
		},
		is_active: {
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
		node_history: [{
			node_id: String,
			visited_at: Date,
			user_response: String
		}],
		// Contador de intentos fallidos (para fallback)
		failed_attempts: {
			type: Number,
			default: 0
		},
		// Si está esperando respuesta del usuario
		waiting_for_response: {
			type: Boolean,
			default: false
		},
		last_bot_message_at: {
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
	timestamps: true
});

// Índices compuestos
conversationSchema.index({ chatbotId: 1, user_phone: 1 }, { unique: true });
conversationSchema.index({ chatbotId: 1, last_message_at: -1 });
conversationSchema.index({ chatbotId: 1, status: 1 });
conversationSchema.index({ 'metadata.tags': 1 });
conversationSchema.index({ 'flow_state.current_node_id': 1 });
conversationSchema.index({ 'flow_state.is_active': 1 });

// Virtual para obtener mensajes
conversationSchema.virtual('messages', {
	ref: 'Message',
	localField: '_id',
	foreignField: 'conversation_id'
});

// **NUEVO: Método para iniciar el flujo**
conversationSchema.methods.startFlow = async function(startNodeId) {
	this.flow_state = {
		current_node_id: startNodeId,
		started_at: new Date(),
		is_active: true,
		variables: new Map(),
		node_history: [],
		failed_attempts: 0,
		waiting_for_response: true
	};
	return this.save();
};

// **NUEVO: Método para avanzar al siguiente nodo**
conversationSchema.methods.moveToNode = async function(nodeId, userResponse = null) {
	if (this.flow_state.current_node_id) {
		this.flow_state.node_history.push({
			node_id: this.flow_state.current_node_id,
			visited_at: new Date(),
			user_response: userResponse
		});
	}

	this.flow_state.current_node_id = nodeId;
	this.flow_state.failed_attempts = 0;
	this.flow_state.waiting_for_response = true;

	return this.save();
};

// **NUEVO: Método para guardar variable del flujo**
conversationSchema.methods.setFlowVariable = async function(key, value) {
	if (!this.flow_state.variables) {
		this.flow_state.variables = new Map();
	}
	this.flow_state.variables.set(key, value);
	return this.save();
};

// **NUEVO: Método para obtener variable del flujo**
conversationSchema.methods.getFlowVariable = function(key) {
	return this.flow_state.variables?.get(key);
};

// **NUEVO: Método para completar el flujo**
conversationSchema.methods.completeFlow = async function() {
	this.flow_state.is_active = false;
	this.flow_state.completed_at = new Date();
	this.flow_state.waiting_for_response = false;
	return this.save();
};

// **NUEVO: Método para reiniciar el flujo**
conversationSchema.methods.resetFlow = async function() {
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
};

// **NUEVO: Método para incrementar intentos fallidos**
conversationSchema.methods.incrementFailedAttempts = async function() {
	this.flow_state.failed_attempts += 1;
	return this.save();
};

// Método para marcar como leída
conversationSchema.methods.markAsRead = async function() {
	this.unread_count = 0;
	return this.save();
};

// Método para incrementar mensajes no leídos
conversationSchema.methods.incrementUnread = async function() {
	this.unread_count += 1;
	this.last_message_at = new Date();
	return this.save();
};

// Método estático para obtener conversaciones activas con populate
conversationSchema.statics.findActiveByAccount = function(accountId, limit = 50) {
	return this.find({
		chatbotId: accountId,
		status: 'active'
	})
			.sort({ last_message_at: -1 })
			.limit(limit)
			.populate('chatbotId', 'phone_number business_name');
};

export default mongoose.model('Conversation', conversationSchema);
