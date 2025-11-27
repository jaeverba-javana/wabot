<script lang="ts">
import {defineComponent} from 'vue'
import {mdiLogout} from "@mdi/js";
// import SVGIcon from '@jamescoyle/vue-icon/lib/svg-icon.vue'
import {useAppStore} from "../../stores/app.store.ts";

import AppBar from "./../components/AppBar.vue"

export default {
	name: "HomeLayout",
	components: {AppBar},
	data() {
		return {
			drawer: true,
			items: [
				{title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/console'},
				{title: 'Configuración', icon: 'mdi-chat', to: '/config'},
				{title: 'Chatbot', icon: '', to: '/chatbot'},
			],
		}
	},
	setup() {
		const appStore = useAppStore()

		return {appStore}
	},
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

		<AppBar />

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
