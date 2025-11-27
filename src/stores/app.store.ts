import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {axiosApi} from "../utils/axios.ts";
import {Defer} from "../utils/core.ts";

export const useAppStore = defineStore("app", () => {
	let isInitialFetchDone = false;
	const user = ref<User | {}>({});
	const chatbot = ref<Chatbot | {}>({});

	const isUserLoggedIn = computed(() => Object.keys(user.value).length > 0);

	const fetch = () =>
		axiosApi.get('/fetch/accountInfo')
			.then(({data}) => {
				  user.value = data.message.user;
					chatbot.value = data.message.chatbot;
					isInitialFetchDone = true;
			})
			.catch(reason => console.error(reason))
			.finally(() => isInitialFetchDone = true);

	const setUser = (u: User) => user.value = u;

	const setChatbot = (c: Chatbot) => chatbot.value = c;

	fetch()

	return {
		isInitialFetchDone,
		user,
		chatbot,
		isUserLoggedIn,
		fetch,
		setUser,
		setChatbot,
	};
});
