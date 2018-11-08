<template>
	<v-expansion-panel v-model="value">
		<v-expansion-panel-content
			:readonly="node.isFile"
			:hide-actions="node.isFile">
			<span slot="header">
				<v-icon>{{node.icon}}</v-icon>
				{{node.label}}
			</span>
			<v-card id="thisNode">
				<node :key="child.label"
					v-for="child in node.children"
					:node="child"
					:handle-click="handleClick"></node>
			</v-card>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	export default {
		name: 'node',
		props: {
			node: Object,
			handleClick: Function,
			value: Number
		},
		watch: {
			value: function() {
				let isOpen = arguments[0] === 0;

				this.handleClick(this.node, isOpen);
			}
		}
	}
</script>

<style>
	.v-expansion-panel__container {
		padding-left: 24px;
	}
	.v-expansion-panel__header:hover,
	.v-expansion-panel .v-expansion-panel__container .v-expansion-panel__header:hover .v-expansion-panel__header__icon .v-icon,
	.theme--dark.v-expansion-panel .v-expansion-panel__container .v-expansion-panel__header:hover .v-expansion-panel__header__icon .v-icon {
		color: var(--v-secondary-base);
		transition: all 200ms;
	}
</style>
