<template>
	<v-layout>
		<v-navigation-drawer permanent app clipped left
			style="width: 50vw;">
			<grid @gameSelected="onGameSelected"></grid>
		</v-navigation-drawer>
		
		<v-navigation-drawer permanent app clipped right
			style="width: 50vw; height: 100vh;">
				<v-card>
						<v-img src="https://picsum.photos/510/300?random" height="50vh"></v-img>
				</v-card>
				<v-card max-height="50vh">
					
				</v-card>
		</v-navigation-drawer>
	</v-layout>
</template>

<script>
	import FS from 'fs';
	import Path from 'path';
	import Tree from './Tree';
	import Grid from './Grid';

	export default {
		name: 'home',
		components: {
			Tree,
			Grid
		},
		mounted() {
			// alert('Finish binding from Home.vue to Grid.vue.\nHave Grid.vue display all files from each dir in prefs, using the dir as the Console Type.');
			this.$electron.ipcRenderer.send('getPreferences');

			//Setup listeners
			// this.$electron.ipcRenderer.on('getPreferences', this.onGetPreferences);
			this.$electron.ipcRenderer.on('setPreferencesComplete', this.onSetPreferencesComplete);
		},
		methods: {
			onSetPreferencesComplete(e) {
				this.$electron.ipcRenderer.send('getPreferences');
			},
			onGameSelected(game) {
				console.log(`Selected ${game.name}.`);
			}
		},
		data: () => ({
			games: [{}]
		})
	}
</script>

<style scoped>

</style>