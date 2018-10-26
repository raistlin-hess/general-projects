<template>
	<v-layout row align-start fill-height>
		<v-layout column align-start fill-height>
			<v-list class="green">
				<v-subheader>Parent: {{baseDir}}</v-subheader>
				<v-list dense v-for="dir in dirChildren" :key="dir.title" class="green">
					<v-btn flat>
						<v-icon>{{dir.icon}}</v-icon>
						{{dir.title}}
					</v-btn>
				</v-list>
			</v-list>
		</v-layout>
		<v-btn floating bottom fab class="green"@click="selectBase()">
			<v-icon>search</v-icon>
		</v-btn>
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
			selectBase () {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						let options = {
							encoding: 'utf-8',
							withFileTypes: true
						};
						this.baseDir = dirs[0];
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
			}
		},
		data: () => ({
			baseDir: '',
			dirChildren: [
				// Object Def:
				// { icon: 'folder', title: 'New Folder', children: [] }
			]
		})
	}
</script>

<style scoped>
	.v-list > .v-subheader	{
		color: white;
		font-weight: bolder;
	}

	.v-list > .v-btn {
		text-transform: none;
	}

	.v-list > .v-btn .v-icon {
		padding-right: 8px;
	}
</style>