import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useAppStore} from "./app.store.ts";
import {axiosApi} from "../utils/axios.ts";
import {useChatbotStore} from "./chatbot.store.ts";

type uId = string;

export const useChatStore = defineStore("chat", () => {
	const chatbotStore = useChatbotStore();

	const actualChatId = ref<string|undefined>(undefined);

	const chats = ref<{
		_id: uId,
		userPhone: string,
	}[]>([]);
	const messages = ref<{[key: uId]: {}[]}>({})

	const isEmpty = computed(() => !chats.value.length);
	const currentSelected = computed(() => chats.value.find(v => v._id === actualChatId.value))
	const selectedMessages = computed(() => {
		if (messages.value[actualChatId.value] === undefined) {
			axiosApi.get('/message/all', {
				params: {
					conversationId: actualChatId.value
				}
			}).then(({data}) => {
				messages.value[actualChatId.value] = data
			}).then(err => console.error(err))

			return []
		}
		return messages.value[actualChatId.value]
	})

	const appStore = useAppStore();

	function selectChat(index: string) {
		actualChatId.value = index
	}

	function fetchMessages() {
		axiosApi.get('/conversation/all').then(({data}) => {
			chats.value = data
		})
	}

	appStore.isUserLoggedIn
		? fetchMessages()
		: appStore.events.on("dataFetched", fetchMessages);

	return {
		actualChatId,
		chats,

		isEmpty,
		currentSelected,
		selectedMessages,

		selectChat
	}
})