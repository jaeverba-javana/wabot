<template>
	<div id="ChatbotView">
		<svg
				ref="svg"
				class="canvas"
				:style="{ cursor: isPanning ? 'grabbing' : 'default' }"
				@mousedown="onMouseDown"
				@mousemove="onMouseMove"
				@mouseup="onMouseUp"
				@mouseleave="onMouseUp"
				@wheel="onWheel"
		>
			<g ref="content"
				 :transform="`translate(${offsetX}, ${offsetY}) scale(${scale})`">

			</g>
		</svg>

		<div class="details"></div>

		<svg class="fab" xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 640 640"><path
				fill="currentColor" d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>
	</div>
</template>

<script lang="ts">
export default {
	name: 'ChatbotView',
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
			minScale: 0.2 as number,
			maxScale: 3 as number,
		}
	},
	methods: {
		onMouseDown(e: MouseEvent) {
			// Middle mouse button initiates panning
			if (e.button === 1) {
				e.preventDefault();
				this.isPanning = true;
				this.panStartX = e.clientX;
				this.panStartY = e.clientY;
				this.startOffsetX = this.offsetX;
				this.startOffsetY = this.offsetY;
			}
		},
		onMouseMove(e: MouseEvent) {

			// Obtener las coordenadas del mouse en el espacio SVG
			// this.mouseX = svgCoords.x;
			// this.mouseY = svgCoords.y;

			// console.log(svgElement)
			// console.log(svgCoords)

			if (!this.isPanning) return;
			e.preventDefault();
			const dx = e.clientX - this.panStartX;
			const dy = e.clientY - this.panStartY;
			this.offsetX = this.startOffsetX + dx;
			this.offsetY = this.startOffsetY + dy;
			this.clampOffsets();
		},
		onMouseUp(e: MouseEvent) {
			if (this.isPanning) {
				e.preventDefault();
				this.isPanning = false;
			}
		},
		onWheel(e: WheelEvent) {
			// Zoom only when Ctrl key is pressed
			if (!e.ctrlKey) return;
			e.preventDefault();


			const svgElement = (this.$refs.svg as SVGSVGElement | undefined);
			const rect = svgElement.getBoundingClientRect();

			const svgCoords = this.screenToSVGManual(e.clientX, e.clientY, svgElement);
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			// console.log(svgCoords)
			// console.log([mouseX, mouseY])
			// console.log([this.offsetX, this.offsetY])

			const zoomIntensity = 0.0015; // tune sensitivity
			// deltaY > 0 => zoom out, deltaY < 0 => zoom in
			const oldScale = this.scale;

			const newScale = this.scale * (1 - e.deltaY * zoomIntensity);
			this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));

			// Ajustar el offset para hacer zoom hacia el mouse
			const scaleDiff = this.scale / oldScale;
			this.offsetX = mouseX - (mouseX - this.offsetX) * scaleDiff;
			this.offsetY = mouseY - (mouseY - this.offsetY) * scaleDiff;
			this.clampOffsets();
		},

		// Método alternativo sin usar getScreenCTM
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


		// Método para convertir coordenadas de pantalla a coordenadas SVG
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

		}
	},
	mounted() {
		this.center()
	}
}
</script>

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
}

.details {
	z-index: 3;
	width: var(--details-width);
	box-shadow: var(--elevation3);
	background-color: white;
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
