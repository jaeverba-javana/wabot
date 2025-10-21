import {defineStore, storeToRefs} from "pinia";
import {useAppStore} from "./app.store.ts";
import {axiosApi} from "../utils/axios.ts";
import {ref} from "vue";

export const useChatbotStore = defineStore('chatbot', () => {
	const {chatbot} = storeToRefs(useAppStore());
	const nodes = ref([])

	const fetchNodes = () => {
		axiosApi.get(`/node/byChatbotId/${chatbot.value._id}`)
			.then(({data}) => {
				nodes.value = data.message
			}).catch(reason => console.error(reason))
	}

	fetchNodes()

	return{
		chatbot,
		nodes
	}
})