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
			<v-dialog persistent max-width="350"
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
		</v-app>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vuetify from 'vuetify';
	import colors from 'vuetify/es5/util/colors';

alert('Need to have way to specify RootDirectories.\n Create preferences window to allow changing this.\n Draw directory list of selected directories.');

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

	export default {
		name: 'gaminator',
		methods: {
			onAppMenuClick(item, index) {
				let scopeFn = this[item.fn];
				if(!scopeFn) {
					this.showError = true;
					this.errMsg = `${item.title} does not have a function defined!`;
					return;
				}

				scopeFn();
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
	html {
		overflow-y: hidden;
	}
	/* @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'); */
	span#tip {
		font-weight: bold;
		font-size: 125%;
	}
</style>
