<template>
	<div class="tree">
		<div id="tree-list">
			<node-tree
				:node="treeData"
				:handle-click="handleClick"></node-tree>
		</div>
	</div>
</template>

<script>
	import NodeTree from './NodeTree';
	export default {
		name: 'tree',
		components: {
			NodeTree
		},
		props: {
			treeData: Object
		},
		methods: {
			handleClick(node) {
				this.$emit('node-click', node);
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

