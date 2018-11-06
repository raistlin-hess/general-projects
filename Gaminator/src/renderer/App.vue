<template>
	<div id="app">
		<v-app dark>
			<v-toolbar fixed app class="primary">
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
				<v-container wrap fluid fill-height grid-list-md>
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
	import colors from 'vuetify/es5/util/colors';
	import mixins from './mixins.js';
	import Preferences from './components/popups/Preferences';
	
	Vue.use(Vuetify, {
		theme: {
			primary: colors.green.base,
			secondary: colors.green.lighten2,
			accent: colors.green.darken3,
			error: colors.red.accent4,
			warning: colors.yellow.base,
			info: colors.blue.base,
			success: colors.green.base
		},
		options: {
			customProperties: true	//https://vuetifyjs.com/en/style/theme
		}
	});

	//Apply mixins globally to all components.
	Vue.mixin(mixins);
alert('Need to find way to limit App to Viewport dimensions.');
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
	/* html {
		overflow-y: hidden;
	} */
	span#tip {
		font-weight: bold;
		font-size: 125%;
	}
</style>
