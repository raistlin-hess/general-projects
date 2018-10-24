<template>
	<v-app id="directory-listing">
		<v-navigation-drawer
			fixed
			v-model="drawer"
			app
		>
			<v-list dense>
				<v-list-tile @click="">
					<v-list-tile-action>
						<v-icon>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Home</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="">
					<v-list-tile-action>
						<v-icon>contact_mail</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Contact</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar color="indigo" dark fixed app>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title>Application</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<v-container fluid fill-height>
				<v-layout
					justify-center
					align-center
				>
					<v-flex text-xs-center>
						<v-tooltip left>
							<v-btn icon large :href="source" target="_blank" slot="activator">
								<v-icon large>code</v-icon>
							</v-btn>
							<v-btn icon medium @click="selectBaseDir()">Select Directory</v-btn>
							<span>Source</span>
						</v-tooltip>
						<v-tooltip right>
							<v-btn icon large href="https://codepen.io/johnjleider/pen/rJdVMq" target="_blank" slot="activator">
								<v-icon large>mdi-codepen</v-icon>
							</v-btn>
							<span>Codepen</span>
						</v-tooltip>
					</v-flex>
				</v-layout>
			</v-container>
		</v-content>
		<v-footer color="indigo" app>
			<span class="white--text">&copy; 2017</span>
		</v-footer>
	</v-app>
</template>

<script>
	const fs = require('fs'),
		nodePath = require('path');
	export default {
		name: 'directory-listing',
		// components: { SystemInformation },
		data: () => ({
			drawer: null
		}),
		props: {
			baseDirectory: String
		},
		methods: {
			selectBaseDir () {
				let me = this;
				
				me.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dir) => {
					if(dir) {
						dir.forEach((dirPath) => {
							fs.lstat(dirPath, (err, stats) => {
								if(err) {
									console.error('Error on '+ dirPath + ': ' + err);
								}

								if(stats.isDirectory()) {
									console.log(dirPath);
									me.baseDirectory = dirPath;
								}
							});
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
