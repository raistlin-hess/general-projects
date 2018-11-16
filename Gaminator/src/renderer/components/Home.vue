<template>
	<v-layout>
		<v-navigation-drawer permanent app clipped left
			style="width: 50vw;">
			<grid @gameSelected="onGameSelected"></grid>
		</v-navigation-drawer>
		
		<v-navigation-drawer permanent app clipped right
			style="width: 50vw; height: 100vh;">
				<v-card max-height="60vh">
						<v-img src="https://picsum.photos/510/300?random" height="60vh"></v-img>
				</v-card>
				<v-card max-height="40vh">
					<v-layout row height="20vh">
						<v-card-text lg4>
							<span class="headline">Manufacturer:<br></span>
							{{selectedGame.manufacturer}}
						</v-card-text>
						<v-card-text lg4>
							<span class="headline">System:<br></span>
							{{selectedGame.system}}
						</v-card-text>
						<v-card-text lg4>
							<span class="headline">Year:<br></span>
							{{selectedGame.year}}
						</v-card-text>
					</v-layout>
					<v-layout row height="20vh">
						<v-card-text lg4>
							<span class="headline">Rating:<br></span>
							<v-rating dense hover
								:v-model="gameRating"></v-rating>
								replace stupid rating with buttons.
						</v-card-text>
						<v-card-text lg4>
							<span class="headline">Play Time:<br></span>
							{{selectedGame.playTime}}
						</v-card-text>
						<v-card-text lg4>
							<span class="headline">Notes:<br></span>
							{{selectedGame.notes}}
						</v-card-text>
					</v-layout>
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
				this.selectedGame = game;
				// this.gameRating = game.rating;
			}
		},
		watch: {
			gameRating(value) {
				console.log(value);
			}
		},
		data: () => ({
			games: [{}],
			selectedGame: {
				manufacturer: '',
				system: '',
				year: '',
				rating: 0,
				playTime: 0,
				notes: ''
			},
			gameRating: 0
		})
	}
</script>

<style scoped>

</style>