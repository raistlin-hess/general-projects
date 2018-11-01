<template>
	<v-layout row>
		<v-flex xs12 md5>
			<v-card>
				
				<v-toolbar class="primary">
					<v-toolbar-title v-if="rootDir.label">
						<v-tooltip bottom>
							<span slot="activator">{{ rootDir.label }}</span>
							<span id="tip">{{ rootDir.path }}</span>
						</v-tooltip>
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon
						@click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>
			</v-card>
		</v-flex>


		<v-flex xs0 md7>
			<v-container>
				<v-layout column>
					<v-card>
						<v-img src="https://picsum.photos/510/300?random" aspect-ratio=1></v-img>
					</v-card>
					<v-card>
						<v-img src="https://picsum.photos/510/300?random" aspect-ratio=1></v-img>
					</v-card>
				</v-layout>
			</v-container>
		</v-flex>
	</v-layout>
</template>

<script>
	const fs = require('fs'),
		path = require('path'),
		walkdir = require('walkdir');

	import Tree from './Tree';

	export default {
		name: 'home',
		components: {
			Tree
		},
		data: () => ({
			rootDir: {
				path: '',
				label: '',
				isFile: false,
				icon: 'folder',
				children: ''
				/* path: '',
				label: 'A cool folder',
				icon: 'folder',
				children: [{
					path: '',
					label: 'A cool sub-folder 1',
					icon: 'folder',
					children: [{
						path: '',
						label: 'A cool sub-sub-folder 1',
						icon: 'folder',
						children: [{
							path: '',
							label: 'A cool sub-sub-sub-file 1',
							icon: 'business_center',
							children: []
						}]
					}]
				}, {
					path: 'C:\\A cool sub-folder 2',
					label: 'A cool sub-folder 2',
					icon: 'business_center',
					children: []
				}] */
			}
		}),
		methods: {
			selectBase() {
				debugger;
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.rootDir.path = dirs[0];
						this.rootDir.label = path.basename(dirs[0]);
						this.rootDir.children = [];

						fs.readdir(this.rootDir.path, {withFileTypes: true}, (err, files) => {
							for(let x = 0; x < files.length; x++) {
								let absPath = `${this.rootDir.path}/${files[x]}`;
								fs.stat(absPath, (err, file) => {
									let label = files[x].replace(this.rootDir.path, '').replace(/^[/\\]/, '');
									let isFile = !file.isDirectory();
									if(isFile) {
										this.rootDir.children.push({
											path: files[x],
											label: label,
											isFile: isFile,
											icon: 'business_center'	//replace with dynamic filetype icon
										});
										} else {
											this.rootDir.children.push({
												path: files[x],
												label: label,
												isFile: isFile,
												icon: 'folder'
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
			logClick(node) {
				if(node.children && node.children.length > 0) {
					console.log(`You opened the "${node.label}" folder.`);
				} else {
					console.log(`You clicked the "${node.label}" file.`);
				}
			}
		}
	}
</script>

<style scoped>
</style>