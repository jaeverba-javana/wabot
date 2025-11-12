<script lang="ts">
import {ComputedRef, defineComponent, PropType, WritableComputedRef} from 'vue'
import ContractibleSection from "../../../../ContraibleSection.vue";
import {useChatbotStore} from "../../../../../stores/chatbot.store.ts";

export default {
	name: "OptionsDetailNodeEditor",
	components: {ContractibleSection},
	emits: ['update:options'],
	props: {
		options: {
			type: Object as PropType<{
				value: WritableComputedRef<{text: string, nextNodeId?: string}[]>,
				errors: ComputedRef<{ [key: string]: string }>,
			}>,
			required: true
		},
	},
	setup(props, { emit }) {
		const chatbotStore = useChatbotStore();

		const createOption = () => {
			props.options.value.value = {type: 'add', data: {text: "reply"}}
		}

		const handleInputText = (index: number, e: string) => {
			// console.log(e.target.value as string)

			props.options.value.value = {type: 'mod', data: {index, content:
						{'text': e}}}

			props.options.value.value = props.options.value.value;
		}

		const handleInputTo = (index: number, e: string) => {
			props.options.value.value = {type: 'mod', data: {index, content:
						{'nextNodeId': e}}}

			props.options.value.value = props.options.value.value;
		}

		return {
			createOption,
			chatbotStore,
			handleInputText,
			handleInputTo
		}
	}
}
</script>

<template>
	<div class="OptionsDetailNodeEditor">
		<div class="container">
			<template v-for="(item, index) in options.value.value">
				<div class="option">
					<div class="option-label">
						<span style="">Texto:</span>
						<input type="text" name="text" :value="item.text"
									 @input="handleInputText(index, $event.target.value)" />

						<span>Next Message:</span>
						<select
								name="" @input="handleInputTo(index, $event.target.value)"
										:value="item.nextNodeId"
						>
							<option value=""></option>
							<option
									v-for="c in chatbotStore.nodes.filter(v =>
									chatbotStore.selectedNodes[0] !== v._id && typeof v._id ===
									'string')">{{ c.name }}
							</option>
						</select>
					</div>


				</div>
			</template>
		</div>

		<button class="add" @click="createOption">AGREGAR</button>
	</div>
</template>

<style scoped>
.OptionsDetailNodeEditor {
	display: flex;
	flex-direction: column;
	gap: .25rem;
}

.container {
	display: flex;
	flex-direction: column;
	gap: .5rem;
}

.option {
	box-shadow: var(--elevation1);
	padding: .25rem;
	cursor: pointer;
	user-select: none;
}

.option-label {
	display: grid;
	gap: .25rem;
	grid-template-columns: auto 1fr;

	span{
		font-size: .8rem;
	}

	input, select  {
		flex: 1;
		background-color: #0001;
		padding: 0 .25rem;
		font-size: .8rem;

		&:focus-visible {
			outline: 0;
		}
	}
}

button.add {
	box-shadow: var(--elevation1);
	padding: .25rem .5rem;
	font-size: .75rem;
	align-self: flex-end;

	background-color: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-onPrimary))
}
</style>