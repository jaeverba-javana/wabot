<script lang="ts">

export default {
	name: "DocsRootView",
	data: () => ({
		videos: [
			{
				src: "https://www.youtube.com/embed/H_2R0k9lF20?si=5YWJ12ozGjbwQN7F",
				title: "¿Cómo crear un chatbot en VANNIA?"
			}, {
				src: "https://www.youtube.com/embed/yX_xvYN87i8?si=W7THBvsQCKDx7u3n",
				title: "Cómo agregar tu whatsapp en meta for developers?"
			}, {
				src: "https://www.youtube.com/embed/GXS3LCk7ciQ?si=DtJdpP-3ZG6KJfv6",
				title: "¿Cómo conectar VANNIA con meta?"
			}, {
				src: "https://www.youtube.com/embed/QHw-1qiUOTI?si=EpkGYidEWvigzaie",
				title: "¿Cómo iniciar sesión en VANNIA?"
			}, {
				src: "https://www.youtube.com/embed/QHw-1qiUOTI?si=550UmP62o9Ky-f8t",
				title: "¿Cómo crear una cuenta en VANNIA?"
			},
		]
	})
}
</script>

<template>
	<div class="root">
		<div class="wrapper">
			<div v-for="video in videos" :key="video.src" class="video-container">

				<iframe width="400" height="225" class="video"
								:src="video.src" title="YouTube video player" frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin"
								allowfullscreen></iframe>
				<h2>{{ video.title }}</h2>
			</div>
		</div>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	align-items: center;
	height: 100%;

	.wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		//justify-items: center;
		align-items: stretch;
	}

	.video-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		//flex: 1 1 30rem;
		overflow: hidden;
		box-shadow: var(--elevation2);
		width: 400px;
	}

	iframe {
		box-shadow: var(--elevation2);
	}

	h2 {
		text-align: center;
	}
}
</style>