<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useChatbotStore} from "../../../stores/chatbot.store.ts";

export default defineComponent({
	name: "MessageCanvas",
	props: {
		node: {type: Object as PropType<FlowNode>, required: true},
		selected: {type: Boolean, default: false},
		isModified: {type: Boolean, default: false}
	},
	emits: ['mousedown'],
	data: () => ({
		hovered: false,

	}),
	setup: () => {
		const chatbotStore = useChatbotStore()

		return{chatbotStore}
	},
	methods: {
		handleNodeMouseDown(event) {
			if (event.button !== 0) return;

			event.preventDefault();
			event.stopPropagation();

			this.$emit('mousedown', event);
			// this.currentAction = 'moving';
			// this.selectedItems = [node];
			// this.startOffsetX = node.metadata.positionX;
			// this.startOffsetY = node.metadata.positionY;
			// this.panStartX = event.clientX;
			// this.panStartY = event.clientY;
		},
		handleHover(event, action) {
			const nodeElement = this.$refs.nodeRect as HTMLOrSVGElement
			// console.log(nodeElement.attributes.filter)
			if (action === 'over') {
				this.hovered = true
				return
			}

			this.hovered = false

		},
		calcLineEnd(nodeId: String) {
			const nn = this.chatbotStore.nodes.find(v =>
				v.name === nodeId
			)!

			return[
				nn.metadata.positionX - this.$props.node.metadata.positionX,
				nn.metadata.positionY - this.$props.node.metadata.positionY + 12.5,
			]
		}
	},
	computed: {
		status() {
			// if (this.isModified) return 'modified'
			if (this.selected) return 'selected'
			if (this.hovered) return 'hovered'
			return 'default'
		},
		isSaved() {
			return !(typeof this.node._id === 'symbol')
		}
	}
})
</script>

<template>
	<g :transform="`translate(${node.metadata.positionX}, ${node.metadata.positionY})`">
		<g class="node" >
			<rect
					ref="nodeRect"
					:x="0" :y="0"
					width="150" :height="25*(node.options.length+1)" rx="5" ry="5"
					:stroke=" !isSaved? '#ff5f5f' :
					isModified? '#ffbf5f' :
					status === 'selected'? '#4fd479' :
					'#a5a5a5'"
					:stroke-width="status === 'selected'? 2 : 1" fill="white"
					:filter="(this.status === 'hovered' || this.status === 'selected') ? 'url(#elevation3)' : ''"/>

			<text :x="0 + 5"
						:y="0/**/ + 18">
				{{ node.name }}
			</text>

			<line v-show="node.options.length > 0"
						:x1="0"
						:y1="0 + 25"
						:x2="0 + 150"
						:y2="0 + 25"
						stroke="currentcolor"
						stroke-width="2"
						opacity="0.5"
			/>

			<template v-for="(op, opi) in node.options">
				<text
						:x="0 + 5"
						:y="0 + 18 + ((opi + 1) * 25)"
				>
					{{ op.text }}
				</text>

				<path v-if="op.nextNodeId"
							:d="`m150,${12.5 + ((opi + 1) * 25)}C200,${12.5 +
							((opi + 1) * 25)},${calcLineEnd(op.nextNodeId).map((v, i) =>
							i===0?v-50:v).join(',')},${calcLineEnd(op.nextNodeId).join(',')}`"
							stroke-width="2"
							stroke="currentcolor" fill="none" />
			</template>


		</g>

		<g class="controls">
			<rect
					@mousedown="handleNodeMouseDown"
					@mouseover.self.stop="handleHover( $event, 'over')"
					@mouseout.self.stop="handleHover($event, 'out')"
					class="move"
					:x="0" :y="0"
					width="150" :height="25*(node.options.length+1)" rx="5" ry="5"
					fill="none"/>

			<!--						<line class="top"
												:x1="node.metadata.positionX + 5"
												:y1="node.metadata.positionY"
												:x2="node.metadata.positionX + 195"
												:y2="node.metadata.positionY"
												stroke-width="2" />-->
			<!--						<line class="bottom"
												:x1="node.metadata.positionX + 5"
												:y1="node.metadata.positionY + 100"
												:x2="node.metadata.positionX + 195"
												:y2="node.metadata.positionY + 100"
												stroke-width="2" />-->
			<!--						<line class="left"
												:x1="node.metadata.positionX + 0"
												:y1="node.metadata.positionY + 5"
												:x2="node.metadata.positionX + 0"
												:y2="node.metadata.positionY + 95"
												stroke-width="2" />-->
			<!--						<line class="right"
												:x1="node.metadata.positionX + 200"
												:y1="node.metadata.positionY + 5"
												:x2="node.metadata.positionX + 200"
												:y2="node.metadata.positionY + 95"
												stroke-width="2" />-->
		</g>
	</g>
</template>

<style scoped>
/*rect{
	filter: drop-shadow(var(--jvi-elevation-dp-6-1));
}*/
.controls {
	.move {
		//cursor: move;
		pointer-events: fill;
	}

	line {
		pointer-events: stroke;

		&.top:hover {
			cursor: n-resize;
		}

		&.left:hover {
			cursor: e-resize;
		}

		&.right:hover {
			cursor: w-resize;
		}

		&.bottom:hover {
			cursor: s-resize;
		}
	}
}
</style>