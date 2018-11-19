<template>
	<span>
		<v-dialog persistent max-width="50vw"
			v-model="showRunDirectoryCache">
			<v-card>
				<v-card-title class="headline">
					Run Directory Cache
					<v-spacer></v-spacer>
					<v-btn icon @click.native="onCloseClick"><v-icon>close</v-icon></v-btn>
				</v-card-title>
				
				<v-card-text :key="emulator"
					v-for="(path, emulator) in dirs">
						{{emulator.toUpperCase()}}: 
						<v-toolbar class="primary">
							<v-toolbar-title>
								{{path}}
							</v-toolbar-title>
						</v-toolbar>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click.native="onCloseClick">Close</v-btn>
					<v-btn color="primary" @click.native="confirmDialog=true">Run</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-layout row justify-center>
			<v-dialog v-model="confirmDialog" persistent max-width="290">
				<v-card v-if="caching">
					<v-card-title class="headline">Caching...</v-card-title>
					<v-card-text centered>
						<v-spacer></v-spacer>
						<v-progress-circular indeterminate color="primary"></v-progress-circular>
					</v-card-text>
				</v-card>
				<v-card v-else>
					<v-card-title class="headline">Are you sure?</v-card-title>
					<v-card-text>
						Are you sure you want to re-run the directory cache?<br>
						<em>This will delete any saved game stats.</em>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" @click.native="confirmDialog = false">No</v-btn>
						<v-btn color="primary" @click.native="onRunClick">Yes</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-layout>
	</span>
</template>

<script>
	import FS from 'fs';
	import Path from 'path';
	import Nedb from 'nedb';
	import Crypto from 'crypto';

	export default {
		name: 'run-directory-cache',
		props: {
			showRunDirectoryCache: false,
			confirmDialog: false
		},
		methods: {
			selectEmulatorDir(emulator) {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.preferences.dirs[emulator] = dirs[0];
					}
				});
			},
			onRunClick() {
				this.caching = true;
				let me = this,
					gameListPath = Path.join(me.appDataDir, 'gameList.db'),
					masterListPath = Path.join(me.appDataDir, 'masterList.db'),
					allPromises = [],
					db, masterListDb;
					
				//Remove old DB
				FS.unlinkSync(gameListPath);

				db = new Nedb({
					autoload: true,
					filename: gameListPath
				});
				masterListDb = new Nedb({
					autoload: true,
					filename: masterListPath
				});

				for(let emulator in me.dirs) {
					if(me.dirs[emulator]) {
						allPromises.push(
							me.buildList(me.dirs[emulator], emulator, masterListDb)
						);
					}
				}

				Promise.all(allPromises)
					.then((gamesToInsert) => {
						console.log('All buildList promises complete.');
						db.insert(gamesToInsert[0], (err) => {
							if(err) {
								throw err;
							}
							console.log('DB Update complete.');
							me.caching = false;
							me.confirmDialog = false;
							me.onCloseClick();
						});
					});
			},
			buildList(emulatorDir, emulator, masterListDb) {
				let me = this;

				return new Promise((resolve, reject) => {
					let games = me.getSubdirectories(emulatorDir, true),
						allPromises = [];

					for(let x = 0; x < games.length; x++) {
						allPromises.push(
							me.lookupGame(games[x], emulator, masterListDb)
						);
					}

					Promise.all(allPromises)
						.then((gamesToInsert) => {
							console.log('All lookupGame promises complete.');
							resolve(gamesToInsert);
						});
				});
			},
			lookupGame(game, emulator, masterListDb) {
				let me = this;

				return new Promise((resolve, reject) => {
					let gameBasename = game.name.split(/\./)[0],
						gameName = gameBasename,
						gameFilename = game.name,
						gameObj = {
								gameId: Crypto.createHash('md5').update(gameFilename).digest('hex'),
								name: gameBasename,
								filename: gameFilename,
								system: emulator.toUpperCase(),
								playCount: 0,
								playTime: 0,
								rating: 0,
								ratingCount: 0,
								year: '',
								manufacturer: '',
								notes: ''
							};

					masterListDb.find({filename: gameBasename}, (err, record) => {
						if(record[0]) {
							gameObj.name = record[0].name;
							gameObj.year = record[0].year;
							gameObj.manufacturer = record[0].manufacturer;
							gameObj.notes = record[0].notes;
							console.log(`Found ${gameBasename}!`);
						}

						resolve(gameObj);
					});
				});
			},
			onCloseClick() {
				this.$emit('update:showRunDirectoryCache', false);
				this.$electron.ipcRenderer.send('getPreferences');
				this.confirmDialog = false;
			}
		},
		data: () => ({
			appDataDir: '',
			caching: false,
			dirs: {
				n64: '',
				snes: '',
				nes: '',
				mame: ''
			}
		}),
		watch: {
			showRunDirectoryCache(newValue) {
				if(!!newValue) {
					this.$electron.ipcRenderer.send('getPreferences');
					this.$electron.ipcRenderer.on('getPreferences', (e, preferences) => {
						this.dirs = preferences.data.dirs;
						this.appDataDir = preferences.data.appDataDir;
					});
				}
			}
		}
	}
</script>

<style scoped>

</style>
