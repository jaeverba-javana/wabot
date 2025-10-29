<script lang="ts">
import {useChatbotStore} from "../../stores/chatbot.store.ts";
import MessageCanvas from "../components/canvas/MessageCanvas.vue";
import {computed, watch} from "vue";

export default {
	name: 'ChatbotView',
	components: {MessageCanvas},
	data() {
		return {
			isPanning: false as boolean,
			offsetX: 0 as number,
			offsetY: 0 as number,
			panStartX: 0 as number,
			panStartY: 0 as number,
			startOffsetX: 0 as number,
			startOffsetY: 0 as number,
			scale: 1 as number,
			currentAction: undefined as 'moving' | undefined,
			startMouseX: 0 as number,
			startMouseY: 0 as number,
			isMouseDownOnNode: false as boolean,
		}
	},
	setup() {
		const chatbotStore = useChatbotStore();

		const detailNode = computed(() => {
				console.log('tamos')
				if (chatbotStore.selectedNodes.length === 1) {
					return chatbotStore.nodes.find(i => i._id === chatbotStore.selectedNodes[0])
				}
				return undefined
			}
		)

		const detail = {
			name: computed({
				get() {
					return detailNode.value?.name ?? '';
				},
				set(v) {
					detailNode.value.name = v;
				},
			}),
			message: {
				header: {
					value: computed({
						get: () => detailNode.value?.message.header,
						set: v => detailNode.value.message.header = v,
					}),
					errors: computed((): string[] => {
						if (!detailNode.value) return [];
						const errors: string[] = [];
						if (detailNode.value.message.header.length > 100)
							errors.push('Demasiado largo...')

						chatbotStore.updateNode({
							_id: detailNode.value._id,
							message: {header: detailNode.value.message.header}
						});
						return errors;
					})
				},
				text: {
					value: computed({
						get: () => detailNode.value?.message.text ?? '',
						set: v => detailNode.value.message.text = v,
					}),
					errors: computed((): string[] => {
						if (!detailNode.value) return [];
						const errors: string[] = [];
						if (!detailNode.value.message.text)
							errors.push('El mensaje es requerido');

						chatbotStore.updateNode({
							_id: detailNode.value._id,
							message: {text: detailNode.value.message.text}
						});
						return errors;
					})
				}
			}
		}

		return {
			minScale: 0.2 as number,
			maxScale: 3 as number,
			zoomIntensity: 0.0015 as number, // tune sensitivity
			chatbotStore,
			detailNode,
			detail
		}
	},

	methods: {
		onMouseDown(e: MouseEvent) {
			if (!this.$refs.svg) return;
			e.preventDefault();

			// Middle mouse button initiates panning
			if (e.button === 1) {
				this.isPanning = true;
				this.panStartX = e.clientX;
				this.panStartY = e.clientY;
				this.startOffsetX = this.offsetX;
				this.startOffsetY = this.offsetY;
				return
			}
			if (e.button === 0) {

				if (e.target === this.$refs.svg) {
					this.chatbotStore.cleanSelectedNodes();
				}
			}
		},

		onMouseMove(e: MouseEvent) {
			// If mouse was pressed on a node, only switch to 'moving' when actual movement occurs and button remains pressed
			if (this.isMouseDownOnNode) {
				// e.buttons & 1 === 1 means left button is currently pressed
				if ((e.buttons & 1) === 1) {
					if (this.currentAction !== 'moving') {
						// Detect any movement from the starting point
						if (e.clientX !== this.startMouseX || e.clientY !== this.startMouseY) {
							this.currentAction = 'moving';
						}
					}
				} else {
					// Left button was released without moving
					this.isMouseDownOnNode = false;
				}
			}

			// Obtener las coordenadas del mouse en el espacio SVG
			// this.mouseX = svgCoords.x;
			// this.mouseY = svgCoords.y;

			// console.log(svgElement)
			// console.log(svgCoords)

			if (this.currentAction === 'moving') {
				// console.log('moving: ', this.selectedItems)
				for (const nodeId of this.chatbotStore.selectedNodes) {
					const currentNodeIndex = this.chatbotStore.nodes.findIndex((i) =>
						i._id === nodeId)

					this.chatbotStore.nodes[currentNodeIndex].metadata.positionX =
						this.chatbotStore.nodes[currentNodeIndex].metadata.positionX +
						(e.movementX / this.scale);
					this.chatbotStore.nodes[currentNodeIndex].metadata.positionY =
						this.chatbotStore.nodes[currentNodeIndex].metadata.positionY +
						(e.movementY / this.scale);
				}
			}

			if (this.isPanning) {
				e.preventDefault();
				const dx = e.clientX - this.panStartX;
				const dy = e.clientY - this.panStartY;
				this.offsetX = this.startOffsetX + dx;
				this.offsetY = this.startOffsetY + dy;
				this.clampOffsets();
			}

		},

		onMouseUp(e: MouseEvent) {
			if (e.button === 1 && this.isPanning) {
				e.preventDefault();
				this.isPanning = false;
			}

			if (e.button === 0) {
				if (this.currentAction === 'moving') {
					this.currentAction = undefined;
					this.chatbotStore.updateSelectedNodesPosition();
					// console.log(e)
				}
				this.isMouseDownOnNode = false;
			}
		},

		onWheel(e: WheelEvent) {
			// Zoom only when Ctrl key is pressed
			if (!e.ctrlKey) return;
			e.preventDefault();


			const svgElement = (this.$refs.svg as SVGSVGElement | undefined);
			const rect = svgElement?.getBoundingClientRect();

			// const svgCoords = this.screenToSVGManual(e.clientX, e.clientY, svgElement);
			const mouseX = e.clientX - rect?.left;
			const mouseY = e.clientY - rect?.top;

			// console.log(svgCoords)
			// console.log([mouseX, mouseY])
			// console.log([this.offsetX, this.offsetY])

			// deltaY > 0 => zoom out, deltaY < 0 => zoom in
			const oldScale = this.scale;

			const newScale = this.scale * (1 - e.deltaY * this.zoomIntensity);
			this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));

			// Ajustar el offset para hacer zoom hacia el mouse
			const scaleDiff = this.scale / oldScale;
			this.offsetX = mouseX - (mouseX - this.offsetX) * scaleDiff;
			this.offsetY = mouseY - (mouseY - this.offsetY) * scaleDiff;
			this.clampOffsets();
		},

		// Metodo alternativo sin usar getScreenCTM
		screenToSVGManual(clientX: number, clientY: number, svgElement: SVGSVGElement) {
			const rect = svgElement.getBoundingClientRect();
			// Convertir de coordenadas de pantalla a coordenadas del viewport SVG
			const x = clientX - rect.left;
			const y = clientY - rect.top;
			// Aplicar la transformación inversa (restar offset y dividir por escala)
			const svgX = (x - this.offsetX) / this.scale;
			const svgY = (y - this.offsetY) / this.scale;
			return {x: svgX, y: svgY};
		},

		// Metodo para convertir coordenadas de pantalla a coordenadas SVG
		screenToSVG(screenX: number, screenY: number, svgElement: SVGSVGElement) {
			const CTM = svgElement.getScreenCTM();
			if (CTM) {
				const point = svgElement.createSVGPoint();
				point.x = screenX;
				point.y = screenY;
				const svgPoint = point.matrixTransform(CTM.inverse());
				return {x: svgPoint.x, y: svgPoint.y};
			}
			return {x: 0, y: 0};
		},

		clampOffsets() {
			const svg = (this.$refs.svg as SVGSVGElement | undefined);
			const content = (this.$refs.content as SVGGElement | undefined);

			if (!svg || !content) return;
			const rect = svg.getBoundingClientRect();
			const viewWidth = rect.width;
			const viewHeight = rect.height;
			const bbox = content.getBBox();
			// transformed bbox on screen: screen = scale*local + offset
			const scaledW = this.scale * bbox.width;
			const scaledH = this.scale * bbox.height;
			const minOffsetX = (viewWidth - this.scale * (bbox.x + bbox.width)) +
				this.scale - viewWidth + 50;
			const maxOffsetX = (-this.scale * bbox.x) + this.scale + viewWidth - 50;
			const minOffsetY = (viewHeight - this.scale * (bbox.y + bbox.height)) +
				this.scale - viewHeight + 50;
			const maxOffsetY = (-this.scale * bbox.y) + this.scale + viewHeight - 50;

			// If content smaller than viewport, center it on that axis
			// if (scaledW <= viewWidth) {
			// 	this.offsetX = (viewWidth - scaledW) / 2 - this.scale * bbox.x;
			// } else {
			this.offsetX = Math.min(Math.max(this.offsetX, minOffsetX),
				maxOffsetX);
			// }

			// if (scaledH <= viewHeight) {
			// 	this.offsetY = (viewHeight - scaledH) / 2 - this.scale * bbox.y;
			// } else {
			this.offsetY = Math.min(Math.max(this.offsetY, minOffsetY), maxOffsetY);
			// }
		},

		center() {
			const svg = (this.$refs.svg as SVGSVGElement | undefined);
			const content = (this.$refs.content as SVGGElement | undefined);

			if (!svg || !content) return;
			const rect = svg.getBoundingClientRect();

			const viewWidth = rect.width;
			const viewHeight = rect.height;


			const bbox = content.getBBox();

			const scaledW = this.scale * bbox.width;
			const scaledH = this.scale * bbox.height;

			this.offsetX = (viewWidth - scaledW) / 2 - this.scale * bbox.x;
			this.offsetY = (viewHeight - scaledH) / 2 - this.scale * bbox.y;

		},

		handleNodeMouseDown(node: any, e: MouseEvent) {
			// if (e.button === 0) {
			// Prepare for potential move, but don't activate until mouse moves
			this.startMouseX = e.clientX;
			this.startMouseY = e.clientY;
			this.isMouseDownOnNode = true;
			if (!this.chatbotStore.selectedNodes.length)
				this.chatbotStore.setSelectedNodes(node._id)
			// }
		},

		stopMoving() {

		}
	},

	mounted() {
		this.center()
	}
	,
	beforeUpdate() {
		// this.center()
	}
}
</script>

<template>
	<div id="ChatbotView">
		<svg
				ref="svg"
				class="canvas"
				:class="[this.currentAction]"
				:style="{ cursor: isPanning ? 'grabbing' : this.currentAction ===
				'moving' ? 'move' : 'default' }"
				@contextmenu.prevent
				@mousedown="onMouseDown"
				@mousemove="onMouseMove"
				@mouseup="onMouseUp"
				@wheel="onWheel"
		>
			<defs>
				<defs>
					<filter id="elevation3" x="-100%" y="-100%" width="300%" height="300%">
						<!-- Primera sombra -->
						<feOffset in="SourceAlpha" dx="0" dy="3" result="offset1"/>
						<feGaussianBlur in="offset1" stdDeviation="5" result="blur1"/>
						<feFlood flood-color="rgba(255, 0, 0, 0.2)" result="color1"/>
						<feComposite in="color1" in2="blur1" operator="in" result="shadow1"/>

						<!-- Segunda sombra -->
						<feOffset in="SourceAlpha" dx="0" dy="6" result="offset2"/>
						<feGaussianBlur in="offset2" stdDeviation="10" result="blur2"/>
						<feFlood flood-color="rgba(0, 0, 255, 0.14)" result="color2"/>
						<feComposite in="color2" in2="blur2" operator="in" result="shadow2"/>

						<!-- Tercera sombra -->
						<feOffset in="SourceAlpha" dx="0" dy="1" result="offset3"/>
						<feGaussianBlur in="offset3" stdDeviation="18" result="blur3"/>
						<feFlood flood-color="rgba(0, 255, 0, 0.12)" result="color3"/>
						<feComposite in="color3" in2="blur3" operator="in" result="shadow3"/>

						<!-- Combinar todas las sombras -->
						<feMerge>
							<feMergeNode in="shadow2"/>
							<feMergeNode in="shadow1"/>
							<feMergeNode in="shadow3"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>

				<filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="8" dy="8" stdDeviation="4"
												flood-color="blue" flood-opacity="0.4"/>
				</filter>
			</defs>

			<g ref="content"
				 :transform="`translate(${offsetX}, ${offsetY}) scale(${scale})`">
				<MessageCanvas v-for="item in chatbotStore.nodes" :key="item._id"
											 :node="item" @mousedown="event =>
											 handleNodeMouseDown(item, event)"
											 :selected="chatbotStore.selectedNodes.includes(item._id)"/>
			</g>
		</svg>

		<div class="details">
			<h2>Detalles</h2>

			<div v-if="chatbotStore.selectedNodes.length === 1" class="wrapper">
				<VTextField
						label="Nombre"
						type="text"
						v-model="detailNode.name"/>

				<h3>Mensaje</h3>

				<VTextField
						label="Header"
						type="text"
						v-model="detail.message.header.value.value"
						:errorMessages="detail.message.header.errors.value"/>

				<VTextarea
						label="Mensaje"
						v-model="detail.message.text.value.value"
						:errorMessages="detail.message.text.errors.value"/>
			</div>
		</div>

		<svg class="fab" xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 640 640">
			<path
					fill="currentColor"
					d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
		</svg>
	</div>
</template>

<style scoped>
#ChatbotView {
	width: 100%;
	height: 100%;
	position: relative;

	display: flex;

	--details-width: 300px;
}

.canvas {
	//width: 100%;
	//height: 100%;
	//z-index: -1;
	flex: 1;
	overflow: visible;
	//pointer-events: none;
	//user-select: none;

	& > g {
		pointer-events: none;
		user-select: none;
	}
}

.details {
	z-index: 3;
	width: var(--details-width);
	box-shadow: var(--elevation3);
	background-color: white;

	padding: .5rem;
	scroll-behavior: smooth;
	/*
	overflow-y: auto;
	*/
	position: relative;

	display: flex;
	flex-direction: column;
	gap: .5rem;

	.wrapper {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		//padding: 0 1rem;


	}
}

.fab {
	height: 49px;
	background-color: rgb(var(--v-theme-primaryContainer));
	color: rgb(var(--v-theme-onPrimaryContainer));
	box-shadow: var(--elevation2);
	border-radius: 25%;
	position: absolute;
	right: calc(var(--details-width) + 16px);
	bottom: 16px;
	cursor: pointer;
	transition: var(--elevation-transition);

	&:hover {
		box-shadow: var(--elevation3);
	}
}
</style>