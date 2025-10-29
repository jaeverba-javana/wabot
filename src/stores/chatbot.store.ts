import {defineStore, storeToRefs} from "pinia";
import {useAppStore} from "./app.store.ts";
import {axiosApi} from "../utils/axios.ts";
import {computed, ref} from "vue";
import {mergeObjects} from "../utils/core.ts";

export const useChatbotStore = defineStore('chatbot', () => {
	const {chatbot} = storeToRefs(useAppStore());
	const appStore = useAppStore();

	const nodes = ref([])
	const selectedNodes = ref([])
	const modifiedNodes = []
	const detailNode = computed(() => {

	})

	const fetchNodes = (): void => {
		axiosApi.get(`/node/byChatbotId/${chatbot.value._id}`)
			.then(({data}) => {
				nodes.value = data.message
			}).catch(reason => console.error(reason));
	}

	const setSelectedNodes = (nodeId: string) => selectedNodes.value = [nodeId]
	const cleanSelectedNodes = () => selectedNodes.value = []
	const updateSelectedNodesPosition = () => {
		const newNodesPositions = selectedNodes.value.map(value => {
			const v = nodes.value.find(i => i._id === value)
			return {
				_id: v._id,
				metadata: {
					positionX: v.metadata.positionX,
					positionY: v.metadata.positionY,
				}
			}
		})

		axiosApi.patch('/nodes', newNodesPositions)
			.then(() => {
				console.log('updated')
				// fetchNodes()
			}).catch(reason => console.error(reason))
	}

	const updateNode = (modifiedNode) => {
		const modifiedNodeIndex = modifiedNodes.findIndex(v => v.data._id === modifiedNode._id)
		const action = () => {
			const mni = modifiedNodes.findIndex(v => v.data._id === modifiedNode._id)
			clearTimeout(modifiedNodes[mni].timer)
			console.log(modifiedNodes[mni].data)
			modifiedNodes.splice(mni, 1)
		}
		console.log(modifiedNodeIndex)
		if (modifiedNodeIndex === -1) {
			const timer = setTimeout(action, 2000)

			modifiedNodes.push({timer, data: modifiedNode})
			return
		}

		const mn = modifiedNodes[modifiedNodeIndex]
		clearTimeout(mn.timer)
		mn.timer = setTimeout(action, 2000)
		mn.data = mergeObjects(mn.data, modifiedNode)
	}

	appStore.fetching.promise.then(() => fetchNodes())

	return {
		chatbot,
		nodes,
		selectedNodes,

		setSelectedNodes,
		cleanSelectedNodes,
		updateSelectedNodesPosition,

		updateNode
	}
})