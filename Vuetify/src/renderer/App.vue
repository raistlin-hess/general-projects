<template>
	<div id="app">
		<v-app dark>
			<v-navigation-drawer
				fixed
				:mini-variant="miniVariant"
				:clipped="clipped"
				v-model="drawer"
				app
			>
				<v-list>
					<v-list-tile :key="i"
						router
						:to="item.to"
						v-for="(item, i) in items"
						exact
					>
						<v-list-tile-action>
							<v-icon v-html="item.icon"></v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="item.title"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>

			<v-toolbar fixed app :clipped-left="clipped" class="green">
				<v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
				<v-toolbar-title v-text="title"></v-toolbar-title>
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

	export default {
		name: 'vuetify',
		data: () => ({
			clipped: false,
			drawer: false,
			fixed: false,
			items: [
				{ icon: 'apps', title: 'Main', to: '/' },
				{ icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
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
