import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useChatStore = defineStore("chat", () => {
	const actualIndex = ref(undefined);

	const chats = ref([]);

	const isEmpty = computed(() => !chats.value.length);

	return {
		actualIndex,
		chats,

		isEmpty
	}
})