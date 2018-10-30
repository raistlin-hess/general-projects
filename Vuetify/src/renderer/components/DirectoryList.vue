<template>
	<v-expansion-panel popout>
		<v-expansion-panel-content :key="node.title"
			v-for="(node, index) in nodes"
			:readonly="node.icon !== 'folder'"
			:hide-actions="node.icon !== 'folder'"
			:rootDir="rootDir"
			:rootDirName="rootDirName"
			:nodes="nodes"
			@input="expandDir($event, node, index)"
		>
			<span slot="header">
				<v-icon>{{node.icon}}</v-icon>
				{{node.title}}
			</span>
			<v-card>
				<v-directory-node :key="node.title"
					v-for="(node, index) in nodes"
					:readonly="node.icon !== 'folder'"
					:hide-actions="node.icon !== 'folder'"
					:rootDir="rootDir"
					:rootDirName="rootDirName"
					:nodes="nodes"
					@input="expandDir($event, node, index)"
				>
				</v-directory-node>
			</v-card>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	const fs = require('fs'),
		path = require('path'),
		walkdir = require('walkdir');

	export default {
		name: 'directory-node',
		// template: `<directory-list></directory-list>`,	//Invoke myself
		props: {
			rootDir: '',
			rootDirName: '',
			nodes: [
				// Object Def:
				// { icon: 'folder', title: 'New Folder', nodes: [] }
			]
		},
		methods: {
			expandDir(value, node, index) {
				if(!value) {
					return;
				}
				if(!node.nodes) {
					node.nodes = [];
				}

				node.nodes.push({
					icon: 'search',
					title: node.title + '-' +index,
					nodes: [{
						icon: 'search',
						title: node.title + '-child',
						nodes: []
					}]
				});
			}
		}
	}
</script>

<style scoped>
	
</style>