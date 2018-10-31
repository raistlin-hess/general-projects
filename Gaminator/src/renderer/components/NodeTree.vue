<template>
		<div @click.stop="handleClick(node)">
			<v-expansion-panel>
				<v-expansion-panel-content
					:readonly="node.isFile"
					:hide-actions="node.isFile"
					:handle-click="handleClick">
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
		</div>
</template>

<script>
	export default {
		name: 'node',
		props: {
			node: Object,
			handleClick: Function
		},
		watch: {
			value: function() {
				var me = this;
				debugger;
				me.handleClick();
			}
		}
	}
</script>

<style>
	.v-expansion-panel__container {
		padding-left: 12px;
	}
	.v-expansion-panel__header:hover,
	.v-expansion-panel .v-expansion-panel__container .v-expansion-panel__header:hover .v-expansion-panel__header__icon .v-icon,
	.theme--dark.v-expansion-panel .v-expansion-panel__container .v-expansion-panel__header:hover .v-expansion-panel__header__icon .v-icon {
		color: var(--v-secondary-base);
		transition: all 200ms;
	}
</style>
