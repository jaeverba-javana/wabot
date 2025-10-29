import {defineStore} from 'pinia'
import {reactive, Ref, ref} from "vue";
import {axiosApi} from "../utils/axios.ts";

interface User {
	email: string
}

interface ChatBot {
	phoneId: string,
	phone: string,
}

export const useAppStore = defineStore("app", () => {
	const user = ref({})
	const chatbot = ref({})

	axiosApi.get('/fetch/accountInfo')
		.then(({data}) => {
			user.value = data.message.user
			chatbot.value = data.message.chatbot
		}).catch(reason => console.error(reason))

	function setUser(u: User) {
		user.value = u
	}

	function setChatbot(c: ChatBot) {
		chatbot.value = c
	}

	return {user, chatbot, setUser, setChatbot}
})