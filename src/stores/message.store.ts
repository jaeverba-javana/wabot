import { defineStore } from "pinia";
import { useAppStore } from "./app.store.ts";
import {axiosApi} from "../utils/axios.ts";

export const useMessageStore = defineStore("message", () => {
	const appStore = useAppStore();

	function fetchMessages() {
		axiosApi.get('/conversations')
	}

	appStore.isUserLoggedIn
		? fetchMessages()
		: appStore.events.on("dataFetched", fetchMessages);

	return {};
});
