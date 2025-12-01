import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	conversationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Conversation',
		required: [true, 'Conversation ID es requerido'],
		index: true
	},
	/*wamid: {
		type: String,
		required: [true, 'WAMID es requerido'],
		unique: true,
		trim: true
	},*/
	direction: {
		type: String,
		enum: ['inbound', 'outbound'],
		required: [true, 'Dirección es requerida']
	},
	from: {
		type: String,
		required: [true, 'Remitente es requerido'],
		trim: true
	},
	to: {
		type: String,
		required: [true, 'Destinatario es requerido'],
		trim: true
	},
	/*timestamp: {
		type: Date,
		default: Date.now,
		index: true
	},*/
	type: {
		type: String,
		enum: ['text', 'image', 'document', 'audio', 'video', 'sticker', 'location',
					 'contacts', 'interactive', 'button', 'template'],
		required: [true, 'Tipo de mensaje es requerido']
	},
	content: {
		body: String,
		header: Object,
		footer: String, // Para mensajes de texto
		media_url: String, // URL del medio descargado
		media_id: String, // ID de WhatsApp del medio
		mime_type: String,
		filename: String,
		caption: String,
		// Para ubicaciones
		latitude: Number,
		longitude: Number,
		address: String,
		// Para mensajes interactivos
		button_text: String,
		list_reply_id: String,
		// Para plantillas
		template_name: String,
		template_language: String
	},
	/*status: {
		type: String,
		enum: ['sent', 'delivered', 'read', 'failed', 'pending'],
		default: 'pending',
		index: true
	},*/
	error: {
		code: Number,
		title: String,
		message: String,
		details: String
	},
	metadata: {
		context: {
			message_id: String, // Si es respuesta a otro mensaje
			from: String
		},
		reaction: {
			emoji: String,
			message_id: String
		},
		forwarded: {
			type: Boolean,
			default: false
		},
		frequently_forwarded: {
			type: Boolean,
			default: false
		}
	}
}, {
	timestamps: true
});

// Índices compuestos para queries frecuentes
messageSchema.index({conversation_id: 1, timestamp: -1});
messageSchema.index({wamid: 1});
messageSchema.index({status: 1, timestamp: 1});
messageSchema.index({direction: 1, timestamp: -1});

// Virtual para saber si es mensaje de texto
messageSchema.virtual('isText').get(function () {
	return this.type === 'text';
});

// Virtual para saber si tiene medios
messageSchema.virtual('hasMedia').get(function () {
	return ['image', 'document', 'audio', 'video', 'sticker'].includes(this.type);
});

// Método de instancia para actualizar estado
messageSchema.methods.updateStatus = async function (newStatus) {
	this.status = newStatus;
	return this.save();
};

// Método estático para obtener mensajes de una conversación con paginación
messageSchema.statics.findByConversation = function (conversationId, page = 1,
																										 limit = 50) {
	return this.find({conversation_id: conversationId})
			.sort({timestamp: -1})
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(); // Devuelve objetos planos (más rápido)
};

// Método estático para buscar por WAMID
messageSchema.statics.findByWamid = function (wamid) {
	return this.findOne({wamid});
};

// Middleware pre-save para validar contenido según tipo
messageSchema.pre('save', function (next) {
	console.log('before save:', this)

	if (this.type === 'text' && !this.content.body) {
		return next(new Error('Mensajes de tipo text requieren content.body'));
	}
	if (this.hasMedia && !this.content.media_id && !this.content.media_url) {
		return next(new Error('Mensajes con media requieren media_id o media_url'));
	}
	next();
});

export const MessageModule = mongoose.model('Message', messageSchema);
