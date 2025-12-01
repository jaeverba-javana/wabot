<script lang="ts">
import {useChatStore} from "../../stores/chat.store.ts";

export default {
	name: "ChatViewer",
	setup() {
		const chatStore = useChatStore();

		return {
			chatStore
		}
	}
}
</script>

<template>
	<div class="bar">
		<h2>{{ chatStore.currentSelected.userPhone }}</h2>
	</div>

	<div class="scrollable">

		<div class="chat-container">
			<svg class="absolute -top-[999px] -left-[999px] w-0 h-0">
				<defs>
					<clipPath id="custom-1764580283873" clipPathUnits="objectBoundingBox">
						<path
								d="M1 1 H0 C0 0.5 0.5 0 1 0 Z"
						/>
					</clipPath>
				</defs>
			</svg>

			<template v-if="chatStore.selectedMessages.length === 0">
				<div class="message l">
					<span class="decor"></span>
					<div class="container"></div>
				</div>
				<div class="message l">
					<span class="decor"></span>
					<div class="container"></div>
				</div>
				<div class="message r">
					<span class="decor"></span>
					<div class="container"></div>
				</div>
			</template>

			<template v-else>
				<div v-for="message in chatStore.selectedMessages"
						 :class="['message', message.direction]" :key="message._id">

					<div class="container">
						<p>{{ message.content.body }}</p>
					</div>
				</div>
			</template>
		</div>

	</div>

	<div class="editor"></div>
</template>

<style scoped>
.bar {
	height: 60px;
	box-shadow: var(--elevation2);

	padding: .25rem 1rem;

	z-index: 1;
}

.scrollable {
	overflow-y: auto;
}

.chat-container {
	flex: 1;
	padding: 1rem 1rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: .25rem;
	overflow-y: auto;

	svg {
		position: absolute;
	}

	.message {
		display: flex;
		align-items: end;
		max-width: 80%;
		min-width: 20%;

		&.outbound {
			color: rgb(var(--v-theme-onPrimaryContainer));
			align-self: end;

			.container {
				border-radius: .5rem .5rem 0 .5rem;
				background-color: rgb(var(--v-theme-primaryContainer));
			}

			& + & {
				.container {
					border-top-right-radius: 0;
				}
			}
		}

		&.inbound {
			color: rgb(var(--v-theme-onTertiaryContainer));
			align-self: start;

			.container {
				border-radius: .5rem .5rem .5rem 0;
				background-color: rgb(var(--v-theme-tertiaryContainer));
			}

			& + & {
				.container {
					border-top-left-radius: 0;
				}
			}
		}

		.decor {
			width: 10px;
			height: 10px;
		}

		.container {
			flex: 1;
			min-height: 16px;
			padding: .25rem .5rem;
		}
	}
}
</style>