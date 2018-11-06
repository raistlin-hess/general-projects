<template>
	<v-dialog max-width="600" max-height="600"
		persistent
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
				<span v-if="key === 'rootDir'">
					{{key}}:
					<v-toolbar class="primary">
						<v-toolbar-title>
							{{val}}
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn icon
							@click="selectRootDir()">
							<v-icon>search</v-icon>
						</v-btn>
					</v-toolbar>
				</span>
				<!-- Boolean Type -->
				<!-- Needs more work. Two-way binding isn't working. -->
				<!-- <span v-else-if="typeof val == 'boolean'">
					<v-switch :label="key"
						:v-model="val"></v-switch>
				</span> -->
				<span v-else>
					{{key}} : {{val}}
				</span>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click.native="onCloseClick">Close</v-btn>
				<v-btn @click.native="onSaveClick">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'preferences',
		methods: {
			selectRootDir() {
				this.$electron.remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirs) => {
					if(dirs) {
						this.preferences.rootDir = dirs[0];
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
				rootDir: '/'
			}
		}),
		mounted() {
			this.$electron.ipcRenderer.send('getPreferences');
			this.$electron.ipcRenderer.on('getPreferences', (e, preferences) => {
				this.preferences = preferences.data;
			});
		}
	}
</script>

<style scoped>

</style>
