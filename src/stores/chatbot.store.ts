import {defineStore, storeToRefs} from "pinia";
import {useAppStore} from "./app.store.ts";
import {axiosApi} from "../utils/axios.ts";
import {computed, Ref, ref} from "vue";
import {mergeObjects} from "../utils/core.ts";

type PFlowNode = Partiall<FlowNode> & { _id: string }

export const useChatbotStore = defineStore('chatbot', () => {
	const {chatbot} = storeToRefs(useAppStore());
	const appStore = useAppStore();

	const nodes = ref<FlowNode[]>([])
	const selectedNodes = ref<string[]>([])
	const _modifiedNodes = ref<PFlowNode[]>([])

	function getDifferentFields<T>(original: T | unknown, changes: Partial<T> | unknown): Partial<T> | undefined {
		// Si changes no es un objeto válido, retornar undefined
		if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
			return undefined;
		}

		const differences: Partial<T> = {};
		let hasDifferences = false;

		// Iterar sobre cada propiedad en el objeto changes
		for (const key in changes) {
			if (!changes.hasOwnProperty(key)) continue;

			const originalValue = original[key];
			const changesValue = changes[key];

			// Verificar si ambos valores son objetos (y no null o arrays)
			const isOriginalObject = originalValue !== null &&
				typeof originalValue === 'object' &&
				!Array.isArray(originalValue);
			const isChangesObject = changesValue !== null &&
				typeof changesValue === 'object' &&
				!Array.isArray(changesValue);

			// Si ambos son objetos, comparar recursivamente
			if (isOriginalObject && isChangesObject) {
				const nestedDifferences = getDifferentFields(originalValue, changesValue);

				if (nestedDifferences !== undefined) {
					differences[key] = nestedDifferences;
					hasDifferences = true;
				}
			}
			// Para valores primitivos, arrays, null, o cuando uno es objeto y otro no
			else {
				// Comparación estricta
				if (JSON.stringify(originalValue) !== JSON.stringify(changesValue)) {
					differences[key] = changesValue;
					hasDifferences = true;
				}
			}
		}

		return hasDifferences ? differences : undefined;
	}

	const fetchNodes = (): void => {
		axiosApi.get(`/node/byChatbotId/${chatbot.value._id}`)
			.then(({data}) => {
				nodes.value = data.message
			}).catch(reason => console.error(reason));
	}

	const modifiedNodeIds = computed<string[]>(() =>
		_modifiedNodes.value.map(v => v._id))

	const modifiedNodes = computed<FlowNode[]>((): FlowNode[] =>
		_modifiedNodes.value.map(v => {
			const cN = nodes.value.find(n => n._id === v._id)

			if (!cN) return v as FlowNode

			return mergeObjects(cN, v) as FlowNode
		})
	)

	const setSelectedNodes = (nodeId: string) => selectedNodes.value = [nodeId]
	const cleanSelectedNodes = () => selectedNodes.value = []
	const updateSelectedNodesPosition = () => {
		const newNodesPositions = selectedNodes.value.map(value => {
			const v = nodes.value.find(i => i._id === value)!
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

	const updateNode = (modifiedNode: PFlowNode) => {
		const index = _modifiedNodes.value.findIndex(v => v._id === modifiedNode._id)

		if (index === -1) {
			_modifiedNodes.value.push(modifiedNode as PFlowNode);
			return;
		}

		const modifications = getDifferentFields(
			nodes.value!.find(v => v._id === modifiedNode._id)!,
			modifiedNode
		)

		if (!modifications) {
			_modifiedNodes.value.splice(index, 1);
			return;
		}

		_modifiedNodes.value[index] = mergeObjects(
			_modifiedNodes.value[index],
			modifications as FlowNode
		)
	}

	const deleteUpdatedNode = (nodeId: string) => {
		const index = _modifiedNodes.value.findIndex(v => v._id === nodeId)
		if (index !== -1) {
			_modifiedNodes.value.splice(index, 1)
		}
	}

	const updateModifiedNode = (nodeId: string) => {
		const index = _modifiedNodes.value.findIndex(v => v._id === nodeId)
		if (index !== -1) {
			axiosApi.patch('/node', modifiedNodes.value.find(v => v._id === nodeId)!)
				.then(value => console.log('updated node: ', value, 'nodeId:', nodeId))
				.catch(reason => console.error(reason))
		}
	}

	appStore.fetching.promise.then(() => fetchNodes())

	return {
		chatbot,
		nodes,
		selectedNodes,

		modifiedNodeIds,
		modifiedNodes,

		setSelectedNodes,
		cleanSelectedNodes,
		updateSelectedNodesPosition,

		updateNode,
		deleteUpdatedNode,
		updateModifiedNode,
	}
})