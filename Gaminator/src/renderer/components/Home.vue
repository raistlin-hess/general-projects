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
						v-if="!rootDir || rootDir === '/'"
						@click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>

				<span :key="child.label"
					v-for="child in rootDir.children">
					<tree
						:tree-data="child"
						@node-click="onNodeClick"></tree>
				</span>
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
	import fs from 'fs';
	import path from 'path';
	import electron from 'electron';

	import Tree from './Tree';

	export default {
		name: 'home',
		components: {
			Tree
		},
		mounted() {
			this.$electron.ipcRenderer.send('getPreferences');

			//Setup listeners
			this.$electron.ipcRenderer.on('getPreferences', this.onGetPreferences);
			this.$electron.ipcRenderer.on('setPreferencesComplete', this.onSetPreferencesComplete);
		},
		data: () => ({
			rootDir: {
				path: '',
				label: '',
				isFile: false,
				icon: 'folder',
				children: []
			}
		}),
		methods: {
			onGetPreferences(e, preferences) {
				if(preferences.data.rootDir !== '/') {
					let path = preferences.data.rootDir,
						pathSplit = path.split('/'),
						label = pathSplit[pathSplit.length-1],
						isFile = false,
						icon = 'folder',
						children = this.getNodeChildren(path);

					this.rootDir = {
						path: path,
						label: label,
						isFile: isFile,
						icon: icon,
						children: children
					};
				}
			},
			onSetPreferencesComplete(e) {
				this.$electron.ipcRenderer.send('getPreferences');
			},
			selectBase() {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.rootDir.path = dirs[0];
						this.rootDir.label = path.basename(dirs[0]);
						this.rootDir.children = this.getNodeChildren(dirs[0]);
					}
				});
			},
			getNodeChildren(parentPath) {
				let nodeChildren = [],
					files = fs.readdirSync(parentPath, {withFileTypes: true});

				for(let x = 0; x < files.length; x++) {
					let filePath = path.join(parentPath, files[x]),//`${parentPath}/${files[x]}`,
						fileStats = fs.statSync(filePath),
						label = files[x].replace(parentPath, '').replace(/^[/\\]/, ''),
						isFile = !fileStats.isDirectory();

					if(isFile) {
						nodeChildren.push({
							path: filePath,
							label: label,
							isFile: isFile,
							icon: 'business_center',	//replace with dynamic filetype icon
							children: []
						});
					} else {
						nodeChildren.push({
							path: filePath,
							label: label,
							isFile: isFile,
							icon: 'folder',
							children: []
						});
					}
				}

				return nodeChildren;
			},
			onNodeClick(node) {
				if(!node.isFile) {
					node.children = this.getNodeChildren(node.path);
				}
			}
		}
	}
</script>

<style scoped>
</style>