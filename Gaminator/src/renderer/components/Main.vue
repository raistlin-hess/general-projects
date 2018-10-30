<template>
	<v-layout row>
		<v-flex xs6 md4>
			<v-card>
				<v-toolbar color="green">
					<v-toolbar-title v-if="rootDir">
						<v-tooltip bottom>
							<span slot="activator">{{ rootDirName }}</span>
							<span id="tip">{{ rootDir }}</span>
						</v-tooltip>
					</v-toolbar-title>
					<v-toolbar-title v-else>Please select a directory</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="selectBase()">
						<v-icon>search</v-icon>
					</v-btn>
				</v-toolbar>

<!-- 
TODOS:
	Make column to mark as BAD.
	Allow sort/search.
	Add category column for the console.
	Find way to hash folder, check for changes on start-up.
	Add button to manually hash.
	Create conigurable keylist to navigate the list.
	Add helper-utility to map buttons for each emulator?
	Add video preview when item is selected.
	Add column to mark as a favorite game?
	Find way to show how many players are supported.
	Maybe find way to show which buttons are used.
  -->

				<v-data-table
					:headers="headers"
					:items="items"
					hide-actions
					must-sort
					class="elevation-1"
				>
					<template slot="items" slot-scope="props">
						<td>{{ props.item.key }}</td>
						<td class="text-xs-right">{{ props.item.key }}</td>
						<td class="text-xs-right">{{ props.item.key }}</td>
						<td class="text-xs-right">{{ props.item.key }}</td>
						<td class="text-xs-right">{{ props.item.key }}</td>
					</template>
				</v-data-table>

			</v-card>
		</v-flex>

	</v-layout>
</template>

<script>
	export default {
		name: 'main',
		data: () => ({
			
		})
	}
</script>

<style scoped>
</style>