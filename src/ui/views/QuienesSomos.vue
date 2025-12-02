<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "QuienesSomos"
})
</script>

<template>
	<div class="quienes-somos">
		<h1>¿QUIÉNES SOMOS?</h1>

		<p class="parrafo">
			En VANNIA creemos que la tecnología debe ser accesible para todos. Nacimos
			con la idea de simplificar lo complejo y ayudar a que personas y pequeñas
			empresas puedan aprovechar herramientas modernas sin necesidad de tener
			conocimientos técnicos.
		</p>

		<p class="parrafo">
			Somos un equipo comprometido con la innovación y el acompañamiento cercano.
			Trabajamos para que cada usuario se sienta seguro, guiado y con la confianza
			de que puede crear, crecer y transformar sus ideas en soluciones reales.
		</p>

		<p class="parrafo">
			En VANNIA, cada proyecto importa y cada persona cuenta. Por eso ponemos
			corazón, claridad y dedicación en todo lo que hacemos.
		</p>

		<div class="seccion">
			<h2>MISIÓN:</h2>
			<p>
				Impulsar a personas y pequeñas empresas brindándoles herramientas
				tecnológicas simples, intuitivas y efectivas, que les permitan automatizar
				procesos, mejorar su comunicación y potenciar su crecimiento sin
				complicaciones.
			</p>
		</div>

		<div class="seccion">
			<h2>VISIÓN:</h2>
			<p>
				Convertirnos en la plataforma líder y más confiable para la creación
				sencilla de soluciones digitales, siendo reconocidos por nuestra cercanía
				humana, nuestra innovación constante y nuestra capacidad de transformar
				ideas en resultados.
			</p>
		</div>
	</div>
</template>

<style scoped>
.quienes-somos {
	max-width: 800px;
	margin: 2rem auto;
	padding: 0 1.5rem;
}

h1 {
	color: rgb(var(--v-theme-primary));
	font-size: 2.5rem;
	text-align: center;
	margin-bottom: 2rem;
}

h2 {
	color: rgb(var(--v-theme-secondary));
	font-size: 1.8rem;
	margin: 1.5rem 0;
}

.parrafo {
	font-size: 1.1rem;
	line-height: 1.6;
	color: rgb(var(--v-theme-onSurface));
	margin-bottom: 1.5rem;
}

.seccion {
	background-color: rgb(var(--v-theme-surface));
	padding: 1.5rem;
	border-radius: 8px;
	margin: 2rem 0;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.seccion p {
	font-size: 1.1rem;
	line-height: 1.6;
	color: rgb(var(--v-theme-onSurface));
}

@media (max-width: 600px) {
	.quienes-somos {
		margin: 1rem auto;
		padding: 0 1rem;
	}

	h1 {
		font-size: 2rem;
	}

	h2 {
		font-size: 1.5rem;
	}

	.parrafo, .seccion p {
		font-size: 1rem;
	}
}
</style>