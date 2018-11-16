<template>
	<v-dialog persistent
		v-model="showPreferences">
		<v-card>
			<v-card-title class="headline">
				Preferences
				<v-spacer></v-spacer>
				<v-btn icon @click.native="onCloseClick"><v-icon>close</v-icon></v-btn>
			</v-card-title>
			
			<v-card-text :key="key"
				v-for="(val, key) in preferences">
				<!-- Directory Type -->
				<!-- <template v-if="key === 'rootDir'"> -->
					<!-- {{key}}:
					<v-toolbar class="primary">
						<v-toolbar-title>
							{{val}}
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn icon
							@click="selectRootDir()">
							<v-icon>search</v-icon>
						</v-btn>
					</v-toolbar> -->
				<!-- </template> -->
				<!-- Boolean Type -->
				<!-- Needs more work. Two-way binding isn't working. -->
				<!-- <span v-else-if="typeof val == 'boolean'">
					<v-switch :label="key"
						:v-model="val"></v-switch>
				</span> -->
				<!-- Rom Dirs -->
				<template v-if="key === 'dirs'">
					<span
						:key="emulator"
						v-for="(path, emulator) in val">
						{{emulator.toUpperCase()}}: 
						<v-toolbar class="primary">
							<v-toolbar-title>
								{{path}}
							</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn icon
								@click="selectEmulatorDir(emulator)">
								<v-icon>search</v-icon>
							</v-btn>
						</v-toolbar>
					</span>
				</template>
				<template v-else>
					{{key}}: {{val}}
				</template>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" @click.native="onCloseClick">Close</v-btn>
				<v-btn color="primary" @click.native="onSaveClick">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'preferences',
		methods: {
			selectEmulatorDir(emulator) {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.preferences.dirs[emulator] = dirs[0];
					}
				});
			},
			onSaveClick() {
				this.savePreferences(this.preferences);
				this.onCloseClick();
			},
			onCloseClick() {
				this.$emit('update:showPreferences', false);
			}
		},
		props: {
			showPreferences: Boolean
		},
		data: () => ({
			preferences: {
				dirs: {
					n64: '',
					snes: '',
					nes: '',
					mame: ''
				}
			}
		}),
		watch: {
			showPreferences(newValue) {
				if(!!newValue) {
					this.$electron.ipcRenderer.send('getPreferences');
					this.$electron.ipcRenderer.on('getPreferences', (e, preferences) => {
						this.preferences = preferences.data;
					});
				}
			}
		}
	}
</script>

<style scoped>

</style>
