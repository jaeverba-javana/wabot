<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "MessageCanvas",
	props: {
		node: {type: Object, required: true}
	},
	emits: ['mousedown'],
	data: () => ({


	}),
	setup: () => {

	},
	methods: {
		handleNodeMouseDown(event) {
			if (event.button !== 0) return;
			console.log("epa")

			this.$emit('mousedown', event);
			// this.currentAction = 'moving';
			// this.selectedItems = [node];
			// this.startOffsetX = node.metadata.positionX;
			// this.startOffsetY = node.metadata.positionY;
			// this.panStartX = event.clientX;
			// this.panStartY = event.clientY;
		}
	}
})
</script>

<template>
	<g>
		<g class="node">
			<rect
					:x="node.metadata.positionX" :y="node.metadata.positionY"
					width="150" :height="25*(node.options.length+1)" rx="5" ry="5"
					stroke="currentcolor" stroke-width="2" fill="white"
					filter="url(#elevation3)"/>

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