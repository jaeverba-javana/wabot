import {defineStore} from 'pinia'
import {Ref, ref} from "vue";
import {axiosApi} from "../utils/axios.ts";

interface User {
	email: string
}

interface ChatBot {
	phoneId: string,
	phone: string,
}

export const useAppStore = defineStore("app", () => {
	const user: Ref<undefined, User> = ref(undefined)
	const chatbot: Ref<undefined, ChatBot> = ref(undefined)

	axiosApi.get('/fetch/accountInfo')
		.then(({data}) => {
			user.value = data.message.user
			chatbot.value = data.message.chatbot
		}).catch(reason => console.error(reason))

	function setUser(user: User) {
		this.user = user
	}

	return {user, chatbot, setUser}
})