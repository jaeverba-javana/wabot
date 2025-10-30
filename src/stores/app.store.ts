import {defineStore} from 'pinia'
import {ref} from "vue";
import {axiosApi} from "../utils/axios.ts";
import {Defer} from "../utils/core.ts";

export const useAppStore = defineStore("app", () => {
	const fetching = new Defer<{ user: User, chatbot: Chatbot }>();
	const user = ref<User | {}>({});
	const chatbot = ref<Chatbot>({});

	const fetch = () =>
		axiosApi.get('/fetch/accountInfo')
			.then(({data}) => {
				fetching.resolve({
					user: data.message.user,
					chatbot: data.message.chatbot
				})
			}).catch(reason => console.error(reason));

	const setUser = (u: User) => user.value = u;

	const setChatbot = (c: Chatbot) => chatbot.value = c;

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