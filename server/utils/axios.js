import axios from "axios";

export const wabaApi = (phoneId, token) => axios.create({
	baseURL: `https://graph.facebook.com/v22.0/${phoneId}/`,
	headers: {
		Authorization: `Bearer ${token}`
	}
})