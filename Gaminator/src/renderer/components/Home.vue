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
							{{ formatPlaytime(selectedGame.playTime) }}
						</v-card-text>
						<v-card-text lg4>
							<span class="headline">Notes:<br></span>
							{{selectedGame.notes}}
						</v-card-text>
					</v-layout>
					<v-layout row height="5vh">
						<v-btn class="primary"
							@click="onPlayClick">
							Play
							<v-icon>play_arrow</v-icon>
						</v-btn>
					</v-layout>
				</v-card>
		</v-navigation-drawer>

		<v-dialog persistent max-width="700"
			v-model="playingGame">
			<v-card>
				<v-card-title class="headline">
					Now Playing:&nbsp;&nbsp;<em>{{selectedGame.name}}</em>
				</v-card-title>
				<v-card-text>
					If you would like to force the the game to stop, please click the button below.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="primary" @click.native="onForceClose">Force Close</v-btn>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog persistent max-width="500"
			v-model="showErrorMsg">
			<v-card>
				<v-card-title class="headline">
					Error
					<v-spacer></v-spacer>
					<v-btn icon @click.native="onErrorCloseClick"><v-icon>close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					{{errorMsg}}
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="primary" @click.native="showErrorMsg =false">Close</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
			this.$electron.ipcRenderer.send('getPreferences');

			//Setup listeners
			this.$electron.ipcRenderer.on('getPreferences', this.onGetPreferences);
			this.$electron.ipcRenderer.on('setPreferencesComplete', this.onSetPreferencesComplete);
			this.$electron.ipcRenderer.on('endGame', this.onEndGame);
			this.$electron.ipcRenderer.on('playGameError', this.playGameError);
		},
		methods: {
			onGetPreferences(e, preferences) {
				this.appDataDir = preferences.data.appDataDir;
			},
			onSetPreferencesComplete(e) {
				this.$electron.ipcRenderer.send('getPreferences');
			},
			onGameSelected(game) {
				this.selectedGame = game;
				this.gameRating = game.rating;
				//TODO: Add event when game selected. Maybe have repo of screenshots?
				//Maybe have video playback?
			},
			onPlayClick() {
				this.playingGame = true;
				this.$electron.ipcRenderer.send('startGame', this.selectedGame);
			},
			onForceClose() {
				this.$electron.ipcRenderer.send('forceClose');
			},
			onEndGame(emitter, totalPlaytime) {
				this.playingGame = false;
				this.selectedGame.playTime += totalPlaytime;
				this.selectedGame.playCount += 1;

				this.updateGame(this.appDataDir, this.selectedGame);
				this.$electron.ipcRenderer.send('getPreferences');
			},
			playGameError(emitter, message) {
				this.playingGame = false;
				this.showErrorMsg = true;
				this.errorMsg = message;
			}
		},
		data: () => ({
			appDataDir: '',
			gameRating: 0,
			playingGame: false,
			errorMsg: '',
			showErrorMsg: false,
			games: [{}],
			selectedGame: {
				gameId: '',
				name: '',
				filename: '',
				system: '',
				playCount: 0,
				playTime: 0,
				rating: 0,
				year: '',
				manufacturer: '',
				notes: ''
			}
		})
	}
</script>

<style scoped>

</style>