"use strict";

import mongoose from "mongoose";

const {Schema, model} = mongoose;

// Schema for predefined responses
const responseSchema = new Schema({
	keyword: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['text', 'image', 'options'],
		default: 'text',
	},
	content: {
		type: String,
		required: true,
	}
});

// Schema for business information
const businessSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	phone: {
		type: String,
		required: true,
		validate: {
			validator: (v) => {
				// Basic validation for international phone numbers
				return /^\+?[1-9]\d{1,14}$/.test(v.replace(/\s+/g, ''));
			},
			message: (props) => `${props.value} no es un número de teléfono válido`,
		},
	}
});

// Schema for chatbot configuration
const chatbotConfigSchema = new Schema({
	welcomeMessage: {
		type: String,
		required: true,
	},
	language: {
		type: String,
		enum: ['es', 'en'],
		default: 'es',
	}
});

// Main chatbot schema
const chatbotSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true,
	},
	messages: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
		}]
	},
	phoneId: {
		type: String,
		required: false,
		unique: true,
		index: true,
		validate: {
			validator: (v) => {
				return /^[0-9]{15}$/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone identifier`,
		},
	},
	token: {
		type: String,
		required: false,
		unique: true,
		validate: {
			validator: (v) => {
				return !!v;
			},
			message: (props) => "Token is required",
		},
	}
}, {
	timestamps: true
});

chatbotSchema.statics.findByUserId = function (userId) {
	return new Promise((resolve, reject) => {
		this.findOne({
			userId,
		}).exec().then(chatbot => {
			resolve(chatbot || new this({userId}).save());
		}).catch(err => reject(err));
	})
};

// Ensure each user can only have one chatbot configuration
// chatbotSchema.index({userId: 1}, {unique: true});

export const Chatbot = model("Chatbot", chatbotSchema);