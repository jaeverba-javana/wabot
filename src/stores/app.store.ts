import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { axiosApi } from "../utils/axios.ts";
import { Defer } from "../utils/core.ts";
import { useEventStore } from "./event.store.ts";

export const useAppStore = defineStore("app", () => {
	let isInitialFetchDone = ref(false);
	const user = ref<User | {}>({});
	const chatbot = ref<Chatbot | {}>({});
	const eventStore = useEventStore("app");

	eventStore.declareEvent("dataFetched");

	eventStore.on("dataFetched", (payload: { user: User; chatbot: Chatbot }) => {
		user.value = payload.user;
		chatbot.value = payload.chatbot;
		isInitialFetchDone.value = true;
	});

	const isUserLoggedIn = computed(() => Object.keys(user.value).length > 0);

	const fetch = () =>
		axiosApi.get("/fetch/accountInfo")
			.then(({ data }) => eventStore.emit("dataFetched", data.message))
			.catch((reason) => console.error(reason))
			.finally(() => isInitialFetchDone.value = true);

	const setUser = (u: User) => user.value = u;

	const setChatbot = (c: Chatbot) => chatbot.value = c;

	fetch();

	return {
		isInitialFetchDone,
		user,
		chatbot,
		isUserLoggedIn,
		fetch,
		setUser,
		setChatbot,
		events: eventStore,
	};
});
