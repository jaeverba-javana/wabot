<script lang="ts">
import {defineComponent} from 'vue'
import {mdiLogout} from "@mdi/js";
import SVGIcon from '@jamescoyle/vue-icon/lib/svg-icon.vue'
import {useAppStore} from "../../stores/app.store.ts";

export default {
	name: "HomeLayout",
	components: {SVGIcon},
	data() {
		return {
			drawer: true,
			items: [
				{title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/console'},
				{title: 'Configuración', icon: 'mdi-chat', to: '/config'},
				{title: 'Chatbot', icon: '', to: '/chatbot'}
			],
		}
	},
	setup() {
		const appStore = useAppStore()

		appStore.fetch()

		return {appStore}
	},
	methods: {
		mdiLogout() {
			return mdiLogout
		},
		logout() {
			// Remove the SESSION_TOKEN cookie
			document.cookie = "SESSION_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			// Reload the page
			window.location.reload();
		}
	}
}
</script>

<template>
	<v-app>
		<v-navigation-drawer v-model="drawer" permanent>
			<v-list-item
					title="WhatsApp Chatbot"
					subtitle="Panel de Control"
			></v-list-item>

			<v-divider></v-divider>

			<v-list density="compact" nav>
				<v-list-item
						v-for="(item, i) in items"
						:key="i"
						:value="item"
						:to="item.to"
						color="primary"
				>
					<template v-slot:prepend>
						<v-icon :icon="item.icon"></v-icon>
					</template>
					<v-list-item-title v-text="item.title"></v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar title="VANNIA" elevation="2">
			<template v-slot:prepend>
				<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			</template>
			<template v-slot:append>
				<v-btn icon @click="logout" title="Cerrar sesión">
					<SVGIcon type="mdi" :path="mdiLogout()"/>
				</v-btn>
			</template>
		</v-app-bar>

		<v-main>
			<router-view/>
		</v-main>
	</v-app>
</template>

<style scoped>
.v-main {
	height: 100dvh;
}
</style>
