<script lang="ts">
import {defineComponent, PropType} from 'vue'

export default defineComponent({
	name: "MessageCanvas",
	props: {
		node: {type: Object as PropType<FlowNode>, required: true},
		selected: {type: Boolean, default: false},
	},
	emits: ['mousedown'],
	data: () => ({
		hovered: false,

	}),
	setup: () => {

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
	},
	computed: {
		status() {
			if (this.selected) return 'selected'
			if (this.hovered) return 'hovered'
			return 'default'
		}
	}
})
</script>

<template>
	<g>
		<g class="node">
			<rect
					ref="nodeRect"
					:x="node.metadata.positionX" :y="node.metadata.positionY"
					width="150" :height="25*(node.options.length+1)" rx="5" ry="5"
					:stroke="status === 'selected'? '#4fd479' : '#a5a5a5'"
					stroke-width="2" fill="white"
					:filter="(this.status === 'hovered' || this.status === 'selected') ? 'url(#elevation3)' : ''"/>

			<text :x="node.metadata.positionX + 5"
						:y="node.metadata.positionY + 18">
				{{ node.name }}
			</text>

			<line v-show="node.options.length > 0"
						:x1="node.metadata.positionX"
						:y1="node.metadata.positionY + 25"
						:x2="node.metadata.positionX + 200"
						:y2="node.metadata.positionY + 25"
						stroke="currentcolor"
						stroke-width="2"/>

		</g>

		<g class="controls">
			<rect
					@mousedown="handleNodeMouseDown"
					@mouseover.self.stop="handleHover( $event, 'over')"
					@mouseout.self.stop="handleHover($event, 'out')"
					class="move"
					:x="node.metadata.positionX" :y="node.metadata.positionY"
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