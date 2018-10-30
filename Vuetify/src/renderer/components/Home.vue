<template>
	<v-layout row>
		<v-flex xs6 md4>
			<v-card >
				<v-toolbar class="primary">
					<v-toolbar-title v-if="rootDir">
						<v-tooltip bottom>
							<span slot="activator">{{ rootDirName }}</span>
							<span id="tip">{{ rootDir }}</span>
						</v-tooltip>
					</v-toolbar-title>
					<v-toolbar-title v-else>Please select a directory</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon
						@click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>

				<tree
					:tree-data="tree"
					@node-click="logClick"></tree>

				<!-- <directory-list 
					:rootDir="rootDir"
					:rootDirName="rootDirName"
					:nodes="nodes"
				></directory-list> -->
			</v-card>
		</v-flex>

		<v-tooltip bottom v-if="rootDir">
			<span id="tip">Begin Search</span>
			<v-btn floating fab slot="activator">
				<v-icon>done</v-icon>
			</v-btn>
		</v-tooltip>
	</v-layout>
</template>

<script>
	const fs = require('fs'),
		path = require('path'),
		walkdir = require('walkdir');

	import DirectoryList from './DirectoryList';
	import Tree from './Tree';

	export default {
		name: 'home',
		components: {
			DirectoryList,
			Tree
		},
		methods: {
			resetDirs() {
				this.rootDir = '';
				this.nodes = [];
			},
			selectBase() {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.resetDirs();
						this.rootDir = dirs[0];
						this.rootDirName = path.basename(dirs[0]);

						fs.readdir(this.rootDir, {withFileTypes: true}, (err, files) => {
							for(let x = 0; x < files.length; x++) {
								let absPath = `${this.rootDir}/${files[x]}`;
								fs.stat(absPath, (err, file) => {
									if(file.isDirectory()) {
										let title = files[x].replace(this.rootDir, '').replace(/^[/\\]/, '');
										this.nodes.push({
											title: title,
											icon: 'folder'
										});
									} else {
										this.nodes.push({
											title: files[x],
											icon: 'business_center'
										});
									}
								});
							}
						});
						//Below is nice for allowing multiple directory/mixed selections.
						/* fs.lstat(this.rootDir, (err, stats) => {
							if(err) {
								console.error('Error on '+ dirPath + ': ' + err);
							}

							if(stats.isDirectory()) {
								debugger;
								walkdir(this.rootDir, {max_depth: 1})
									.on('file', (file, stats) => {
										this.nodes.push({
											title: file,
											icon: 'business_center'
										});
									})
									.on('directory', (folder, stats) => {
										let title = folder.replace(this.rootDir, '');
										title = title.replace(/^[/\\]/, '');
										this.nodes.push({
											title: title,
											icon: 'folder'
										});
									})
									.on('error', (fn, err) => {
										console.error(`!!!! ${fn} ${err}`);
									});
							}
						}); */
					}
				});
			},
			expandDir(value, node, index) {
				if(!value) {
					return;
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
			},
			logClick(node) {
				if(node.icon === 'folder') {
					console.log(`You opened the "${node.label}" folder.`);
				} else {
					console.log(`You clicked the "${node.label}" file.`);
				}
			}
		},
		// props: {
		// 	rootDir: '',
		// 	rootDirName: '',
		// 	nodes: [
		// 		// Object Def:
		// 		// { icon: 'folder', title: 'New Folder', nodes: [] }
		// 	]
		// },
		data: () => ({
			rootDir: '',
			tree: {
				label: "A cool folder",
				icon: 'folder',
				children: [
					{
					label: "A cool sub-folder 1",
					icon: 'folder',
					children: [
						{ label: "A cool sub-sub-file 2", icon: 'business_center' },
						{
							label: "A cool sub-sub-folder 1",
							icon: 'folder',
							children: [{
								label: "A cool sub-sub-sub-file 1",
								icon: 'business_center'
							}]
						}
					]
					},
					{ label: "This one is not that cool", icon: 'business_center' }
				]
			}
			// rootDir: '',
			// rootDirName: '',
			// nodes: [
			// 	// Object Def:
			// 	// { icon: 'folder', title: 'New Folder', nodes: [] }
			// ]
		})
	}
</script>

<style scoped>
</style>