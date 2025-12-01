<script lang="ts">
import {
	mdiArrowTopRight,
	mdiLogout,
	mdiSwapVerticalVariant,
	mdiBookOpenBlankVariantOutline
} from "@mdi/js";
import {useAppStore} from "../../stores/app.store.ts";
import SVGIcon from "@jamescoyle/vue-icon/lib/svg-icon.vue";

export default {
	name: "AppBar",
	components: {SVGIcon},
	setup() {
		const appStore = useAppStore();

		const mdi = {
			logout: mdiLogout,
			swap: mdiSwapVerticalVariant,
			book: mdiBookOpenBlankVariantOutline,
			arrow: mdiArrowTopRight
		}

		const GUIDE_PDF_PATH = '/docs/guide.pdf';

		return {appStore, mdi, GUIDE_PDF_PATH};
	},
	methods: {
		logout() {
			// Remove the SESSION_TOKEN cookie
			document.cookie = "SESSION_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			// Reload the page
			window.location.reload();
		},
		openGuide() {
			window.open(this.GUIDE_PDF_PATH, '_blank');
		}
	}
}
</script>

<template>
	<v-app-bar color="transparent" elevation="3" app>
		<v-container class="py-0 fill-height">
			<v-app-bar-title class="text-h6 font-weight-bold">
				<div class="wrapper">

					<div class="logo">
						<img src="/img/logo/Propuesta 1.png" alt="logo"/>
					</div>
				</div>
			</v-app-bar-title>

			<v-spacer></v-spacer>

			<v-btn to="/docs" color="secondary" variant="text" class="me-2">
				Tutoriales

				<template v-slot:prepend>
					<SVGIcon type="mdi" :path="mdi.book"/>
				</template>
			</v-btn>

			<v-btn @click="openGuide" target="_blank"
						 color="secondary"
						 variant="text" class="me-2">
				Gu&iacute;a

				<template v-slot:prepend>
					<SVGIcon type="mdi" :path="mdi.swap"/>
				</template>

				<template v-slot:append>
					<SVGIcon type="mdi" :path="mdi.arrow"/>
				</template>
			</v-btn>

			<v-divider vertical></v-divider>

			<template v-if="appStore.isUserLoggedIn">
				<v-btn icon @click="logout" color="error" title="Cerrar sesión">
					<SVGIcon type="mdi" :path="mdi.logout"/>
				</v-btn>
			</template>

			<template v-else>
				<v-btn to="/auth/login" color="primary" variant="text" class="me-2">
					Iniciar Sesión
				</v-btn>

				<v-btn to="/auth/signup" color="primary" variant="outlined">
					Registrarse
				</v-btn>
			</template>
		</v-container>
	</v-app-bar>
</template>

<style scoped>

.v-divider {
	margin: 0 12px;
}

.v-toolbar-title .wrapper {
	display: flex;
	align-items: center;
	position: relative;

	img {
		height: 60px;
		width: 60px;
		transform: scale(1.7);
	}
}
</style>