<script lang="ts">

import {mdiChevronDown, mdiChevronUp} from '@mdi/js';

export default {
	name: "ContractibleSection",
	props: {
		title: {
			type: String,
			required: true
		},
		titleTag: {
			type: String,
			default: 'h3'
		}
	},
	data: () => ({
		expanded: false,
	}),
	setup() {
		return {
			icons: {
				chevronDown: mdiChevronDown,
				chevronUp: mdiChevronUp,
			}
		}
	}
}
</script>

<template>
	<div class="contractible-section">
		<div class="title">
			<component :is="titleTag">
				{{ title }}
			</component>

			<div class="expand-icon">
				<SVGIcon
						type="mdi" :path="icons.chevronDown" class="icon"
						@click="expanded = !expanded"
						:style="{transform: expanded? 'scaleY(-1)' : 'scaleY(1)'}"
				/>
			</div>

		</div>

		<div class="wrapper" :style="{height: expanded ? 'auto' : '0px'}">
			<div>
				<slot></slot>
			</div>
		</div>
	</div>


</template>

<style scoped>

.contractible-section {
	padding: calc(var(--totalPadding) / 2);
	background-color: rgb(var(--v-theme-surfaceVariant));
	box-shadow: var(--elevation1);
	border-radius: .25rem;
	overflow: hidden;

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.expand-icon {
			cursor: pointer;
			height: 24px;
			box-shadow: var(--elevation0);
			transition: var(--elevation-transition);
			border-radius: .25rem;

			.icon {
				transition: transform .2s ease-in-out;
			}

			&:hover {
				box-shadow: var(--elevation1);
			}
		}
	}

	.wrapper {
		height: 0px;

		> * {
			padding-top: .5rem;

		}
	}
}

</style>