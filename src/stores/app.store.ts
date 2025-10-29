import {defineStore} from 'pinia'
import {reactive, Ref, ref} from "vue";
import {axiosApi} from "../utils/axios.ts";
import {Defer} from "../utils/core.ts";

interface User {
	email: string
}

interface Chatbot {
	phoneId: string,
	phone: string,
}

export const useAppStore = defineStore("app", () => {
	const fetching = new Defer<{ user: User, chatbot: Chatbot }>();
	const user = ref({});
	const chatbot = ref({});

	const fetch = () =>
		axiosApi.get('/fetch/accountInfo')
			.then(({data}) => {
				fetching.resolve({
					user: data.message.user,
					chatbot: data.message.chatbot
				})
			}).catch(reason => console.error(reason));

	const setUser = (u: User) => user.value = u;

	const setChatbot = (c: ChatBot) => chatbot.value = c;

	fetching.promise.then((m) => {
		setUser(m.user)
		setChatbot(m.chatbot)
	})

	return {
		fetching,
		user,
		chatbot,
		fetch,
		setUser,
		setChatbot
	};
})