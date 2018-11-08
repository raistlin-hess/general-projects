<template>
	<div id="app">
		<v-app dark>
			<v-toolbar clipped-left fixed app class="primary">
				<v-menu transition="slide-x-transition">
						<v-btn icon slot="activator">
							<v-icon>more_vert</v-icon>
						</v-btn>
						<v-list>
							<v-list-tile
								v-for="(item, index) in appMenuItems"
								:key="index"
								@click="onAppMenuClick(item, index)">
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>

				<v-toolbar-title v-text="this.$route.name"></v-toolbar-title>
			</v-toolbar>
		
			<v-content>
				<v-container fluid align-start grid-list-lg>
					<v-slide-y-transition mode="out-in">
						<router-view></router-view>
					</v-slide-y-transition>
				</v-container>
			</v-content>

			<!-- Error block -->
			<v-dialog max-width="350"
				persistent
				v-model="showError">
        <v-card class="primary">
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
						{{errMsg}}
					</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="showError=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

			<preferences
				:showPreferences.sync="showPreferences"></preferences>
		</v-app>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vuetify from 'vuetify';
	import Colors from 'vuetify/es5/util/colors';
	import Mixins from './mixins.js';
	import Preferences from './components/popups/Preferences';
	
	Vue.use(Vuetify, {
		theme: {
			primary: Colors.green.base,
			secondary: Colors.green.lighten2,
			accent: Colors.green.darken3,
			error: Colors.red.accent4,
			warning: Colors.yellow.base,
			info: Colors.blue.base,
			success: Colors.green.base
		},
		options: {
			customProperties: true	//https://vuetifyjs.com/en/style/theme
		}
	});

	//Apply mixins globally to all components.
	Vue.mixin(Mixins);
	export default {
		name: 'gaminator',
		components: {
			Preferences
		},
		methods: {
			onAppMenuClick(item, index) {
				let scopeFn = this[item.fn];
				if(scopeFn) {
					scopeFn();
				} else {
					this.showError = true;
					this.errMsg = `${item.title} does not have a function defined!`;
				}
			},
			onPreferences() {
				this.showPreferences = true;
			},
			onExit() {
				this.$electron.ipcRenderer.send('onExit');
				window.close();
			}
		},
		data: () => ({
			routes: [
				{ icon: 'apps', name: 'Gaminator', to: '/' },
				// { icon: 'bubble_chart', name: 'Inspire', to: '/inspire' }
			],
			showError: false,
			showPreferences: false,
			errMsg: '',
			appMenuItems: [{
				title: 'Preferences',
				fn: 'onPreferences'
			}, {
				title: 'Run Directory Cache',
				fn: 'onRunDirectoryCache'
			}, {
				title: 'Exit',
				fn: 'onExit'
			}]
		})
	}
</script>

<!-- Styles are applied globally. -->
<style>
	@import url('assets/MaterialIcons.css');
	@import url('assets/Scrollbar.css');

	html {
		overflow-y: hidden;
	}
	span#tip {
		font-weight: bold;
		font-size: 125%;
	}
</style>
