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
				<v-container align-start grid-list-lg>
					<v-slide-y-transition mode="out-in">
						<router-view></router-view>
					</v-slide-y-transition>
				</v-container>
			</v-content>

			<!-- Dialog boxes -->
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

			<preferences :showPreferences.sync="showPreferences"></preferences>
			<run-directory-cache :showRunDirectoryCache.sync="showRunDirectoryCache"></run-directory-cache>
		</v-app>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vuetify from 'vuetify';
	import Colors from 'vuetify/es5/util/colors';
	
	import Mixins from './mixins.js';
	import Preferences from './components/popups/Preferences';
	import RunDirectoryCache from './components/popups/RunDirectoryCache';

	//Define theme styles
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

	//Take theme styles and convert to comma-separated list and add as CSS variable.
	//This allows adding transparency to the colors. For example: 
	// --var-name: 250, 250, 120;
	//background-color: rgba(var(--var-name), 0.4); = background-color: rgba(250, 250, 120, 0.4);
	let primary = Colors.green.base+'',
		secondary = Colors.green.lighten2+'',
		accent = Colors.green.darken3+'',
		error = Colors.red.accent4+'',
		warning = Colors.yellow.base+'',
		info = Colors.blue.base+'',
		success = Colors.green.base+'';
		
	let primaryStr = `${parseInt(primary.substring(1, 3), 16)}, ${parseInt(primary.substring(3, 5), 16)}, ${parseInt(primary.substring(5, 7), 16)}`,
		secondaryStr = `${parseInt(secondary.substring(1, 3), 16)}, ${parseInt(secondary.substring(3, 5), 16)}, ${parseInt(secondary.substring(5, 7), 16)}`,
		accentStr = `${parseInt(accent.substring(1, 3), 16)}, ${parseInt(accent.substring(3, 5), 16)}, ${parseInt(accent.substring(5, 7), 16)}`,
		errorStr = `${parseInt(error.substring(1, 3), 16)}, ${parseInt(error.substring(3, 5), 16)}, ${parseInt(error.substring(5, 7), 16)}`,
		warningStr = `${parseInt(warning.substring(1, 3), 16)}, ${parseInt(warning.substring(3, 5), 16)}, ${parseInt(warning.substring(5, 7), 16)}`,
		infoStr = `${parseInt(info.substring(1, 3), 16)}, ${parseInt(info.substring(3, 5), 16)}, ${parseInt(info.substring(5, 7), 16)}`,
		successStr = `${parseInt(success.substring(1, 3), 16)}, ${parseInt(success.substring(3, 5), 16)}, ${parseInt(success.substring(5, 7), 16)}`;

	let style = document.createElement('style');
	style.appendChild(document.createTextNode(''));	//Webkit fix
	document.head.appendChild(style);
	style.sheet.insertRule(`:root {
			--primary-rgb: ${primaryStr};
			--secondary-rgb: ${secondaryStr};
			--accent-rgb: ${accentStr};
			--error-rgb: ${errorStr};
			--warning-rgb: ${warningStr};
			--info-rgb: ${infoStr};
			--success-rgb: ${successStr};
		}`, 0);


	export default {
		name: 'gaminator',
		components: {
			Preferences,
			RunDirectoryCache
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
			onRunDirectoryCache() {
				this.showRunDirectoryCache = true;
			},
			onExit() {
				this.$electron.ipcRenderer.send('onExit');
				window.close();
			}
		},
		data: () => ({
			routes: [
				{ icon: 'apps', name: 'Gaminator', to: '/' }
			],
			showError: false,
			showPreferences: false,
			showRunDirectoryCache: false,
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
