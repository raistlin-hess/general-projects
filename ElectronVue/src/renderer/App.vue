<template>
	<div id="app">
		<!-- <landing-page></landing-page> -->
		<directory-listing></directory-listing>
	</div>
</template>

<script>
	const vuetify = require('vuetify');
	import LandingPage from '@/components/LandingPage';
	import DirectoryListing from '@/components/DirectoryListing';

	export default {
		name: 'duplicate-checking',
		components: {
			LandingPage,
			DirectoryListing
		}
	}
</script>

<style>
	/* CSS */
</style>
