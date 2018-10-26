<template>
	<v-layout row>
		<v-flex xs6 md4>
			<v-card>
				<v-toolbar color="green">
					<v-toolbar-title v-if="baseDir">
						<v-tooltip bottom>
							<span slot="activator">{{ baseDirName }}</span>
							<span id="tip">{{ baseDir }}</span>
						</v-tooltip>
					</v-toolbar-title>
					<v-toolbar-title v-else>Please select a directory</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>

				<v-expansion-panel popout>
					<v-expansion-panel-content
						v-for="item in dirChildren"
						:key="item.title"
						:readonly="item.icon !== 'folder'"
						:hide-actions="item.icon !== 'folder'"
					>
						<span slot="header">
							<v-icon>{{item.icon}}</v-icon>
							{{item.title}}
						</span>
						<v-card>
							<v-card-text>{{item.title}}</v-card-text>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- <v-list>
					<v-list-tile
						v-for="item in dirChildren"
						:key="item.title"
						@click=""
					>
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="item.title"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list> -->
			</v-card>
		</v-flex>
		<v-tooltip bottom v-if="baseDir">
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

	export default {
		name: 'main',
		// components: { SystemInformation },
		methods: {
			resetDirs: function() {
				this.baseDir = '';
				this.dirChildren = [];
			},
			selectBase: function() {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.resetDirs();
						this.baseDir = dirs[0];
						this.baseDirName = path.basename(dirs[0]);
						let children = [];
						let options = {
							encoding: 'utf-8',
							withFileTypes: true
						};

						fs.readdir(this.baseDir, options, (err, files) => {
							for(let x = 0; x < files.length; x++) {
								let absPath = `${this.baseDir}/${files[x]}`;
								fs.stat(absPath, (err, file) => {
									if(file.isDirectory()) {
										let title = files[x].replace(this.baseDir, '').replace(/^[/\\]/, '');
										this.dirChildren.push({
											title: title,
											icon: 'folder'
										});
									} else {
										this.dirChildren.push({
											title: files[x],
											icon: 'business_center'
										});
									}
								});
							}
						});
						//Below is nice for allowing multiple directory/mixed selections.
						/* fs.lstat(this.baseDir, (err, stats) => {
							if(err) {
								console.error('Error on '+ dirPath + ': ' + err);
							}

							if(stats.isDirectory()) {
								debugger;
								walkdir(this.baseDir, {max_depth: 1})
									.on('file', (file, stats) => {
										this.dirChildren.push({
											title: file,
											icon: 'business_center'
										});
									})
									.on('directory', (folder, stats) => {
										let title = folder.replace(this.baseDir, '');
										title = title.replace(/^[/\\]/, '');
										this.dirChildren.push({
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
			expandDir: function(selected) {

			}
		},
		data: () => ({
			baseDir: '',
			baseDirName: '',
			dirChildren: [
				// Object Def:
				// { icon: 'folder', title: 'New Folder', children: [] }
			]
		})
	}
</script>

<style scoped>
	/* .v-list > .v-subheader	{
		color: white;
		font-weight: bolder;
	}

	.v-list > .v-btn {
		text-transform: none;
	}

	.v-list > .v-btn .v-icon {
		padding-right: 8px;
	} */

	span#tip {
		font-weight: bold;
		font-size: 125%;
	}
</style>