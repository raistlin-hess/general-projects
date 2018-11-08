<template>
	<div class="tree">
		<div id="tree-list">
			<node
				:node="treeData"
				:handle-click="handleClick"></node>
		</div>
	</div>
</template>

<script>
	import Node from './Node';
	
	export default {
		name: 'tree',
		components: {
			Node
		},
		props: {
			treeData: Object
		},
		methods: {
			handleClick(node, isOpen) {
				this.$emit('node-click', node, isOpen);
			}
		}
	}
</script>

<style scoped>
	.tree-list ul {
		padding-left: 16px;
		margin: 6px 0;
	}
</style>

