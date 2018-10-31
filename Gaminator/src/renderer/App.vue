<template>
	<div id="app">
		<v-app dark>
			<v-navigation-drawer app fixed
				v-model="drawer"
				:mini-variant="miniVariant"
				:clipped="clipped"
			>
				<v-list>
					<v-list-tile :key="i"
						router
						:to="route.to"
						v-for="(route, i) in routes"
						exact
					>
						<v-list-tile-action>
							<v-icon v-html="route.icon"></v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="route.name"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>

			<v-toolbar fixed app class="primary"
				:clipped-left="clipped">
				<v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
				<v-toolbar-title v-text="this.$route.name"></v-toolbar-title>
			</v-toolbar>
		
			<v-content>
				<v-container fluid fill-height>
					<v-slide-y-transition mode="out-in">
						<router-view></router-view>
					</v-slide-y-transition>
				</v-container>
			</v-content>
		
			<!-- <v-footer :fixed="fixed" inset app>
				<span>Add breadcrumb here?</span>
			</v-footer> -->
		</v-app>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vuetify from 'vuetify';
	import colors from 'vuetify/es5/util/colors';
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
		data: () => ({
			clipped: false,
			drawer: false,
			fixed: false,
			routes: [
				{ icon: 'apps', name: 'Gaminator', to: '/' },
				// { icon: 'bubble_chart', name: 'Inspire', to: '/inspire' }
			],
			miniVariant: false,
			title: 'Main'
		})
	}
</script>

<!-- Styles are applied globally. -->
<style>
	@import url('assets/MaterialIcons.css');
	/* @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'); */
	span#tip {
		font-weight: bold;
		font-size: 125%;
	}
</style>
