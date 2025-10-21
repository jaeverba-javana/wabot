import {Schema, model} from "mongoose";

const messageSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		// required: true,
		index: true,
	},
	chatbotId: {
		type: Schema.Types.ObjectId,
		ref: 'Chatbot',
		required: true,
		index: true,
	}
}, {
	timestamps: true,
})

export const Message = model("Message", messageSchema);