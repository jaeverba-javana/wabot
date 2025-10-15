<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "MessageCanvas"
})
</script>

<template>
<g>
	<rect x="100" y="50" width="200" height="100" rx="4" ry="4"
				style="fill:none;stroke:black;stroke-width:2px"
				transform="translate(-100,-50)"/>
</g>
</template>

<style scoped>

</style>