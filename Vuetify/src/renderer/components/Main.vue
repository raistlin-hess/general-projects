<template>
	<v-layout row>
		<v-flex xs6 md4>
			<v-card>
				<v-toolbar color="green">
					<v-toolbar-title v-if="rootDir">
						<v-tooltip bottom>
							<span slot="activator">{{ rootDirName }}</span>
							<span id="tip">{{ rootDir }}</span>
						</v-tooltip>
					</v-toolbar-title>
					<v-toolbar-title v-else>Please select a directory</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>

				<directory-list 
					:rootDir="rootDir"
					:rootDirName="rootDirName"
					:nodes="nodes"
				>
				</directory-list>

				<!-- <v-expansion-panel popout>
					<v-expansion-panel-content :key="node.title"
						v-for="(node, index) in nodes"
						:readonly="node.icon !== 'folder'"
						:hide-actions="node.icon !== 'folder'"
						@input="expandDir($event, node, index)"
					>
						<span slot="header">
							<v-icon>{{node.icon}}</v-icon>
							{{node.title}}
						</span>
						<v-card>
							<v-expansion-panel>
								<v-expansion-panel-content :key="index"
									v-for="(node, index) in nodes"
									:readonly="node.icon !== 'folder'"
									:hide-actions="node.icon !== 'folder'"
									@input="expandDir($event, node.title, index)"
								>
									<span slot="header">
										<v-icon>{{node.icon}}</v-icon>
										{{node.title}}
									</span>
									<v-card>
										<v-card-title>{{node.title}}</v-card-title>
									</v-card>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel> -->


			</v-card>
		</v-flex>

		<v-tooltip bottom v-if="rootDir">
			<span id="tip">Begin Search</span>
			<v-btn class="green" floating fab slot="activator">
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

	export default {
		name: 'main',
		components: {
			DirectoryList
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
			}
		},
		props: {
			rootDir: '',
			rootDirName: '',
			nodes: [
				// Object Def:
				// { icon: 'folder', title: 'New Folder', nodes: [] }
			]
		},
		data: () => ({
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