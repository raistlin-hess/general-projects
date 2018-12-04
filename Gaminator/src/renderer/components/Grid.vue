<template>
	<span>
		<v-btn flat icon color="primary"
			@click.native="onRefreshClick">
			<v-icon>refresh</v-icon>
		</v-btn>
		<v-data-table must-sort hide-actions
			:loading="loading"
			:headers="headers"
			:items="games"
			:pagination.sync="pagination">
			<template slot="items" slot-scope="props">
				<tr :class="{'row-selected': selectedRowIndex == props.index}"
					@click="onRowClick(props.index)">
					<td>{{props.item.name}}</td>
					<td>{{props.item.system}}</td>
					<td>{{props.item.playCount}}</td>
					<td>{{props.item.ratingCount}}</td>
					<td>{{props.item.overallRating + '%'}}</td>
					<td>{{formatPlaytime(props.item.playTime)}}</td>
				</tr>
			</template>
		</v-data-table>
	</span>
</template>

<script>
	import FS from 'fs';
	import Path from 'path';
	import Nedb from 'nedb';

	export default {
		name: 'grid',
		mounted() {
			var me = this;
			me.$electron.ipcRenderer.on('getPreferences', me.onGetPreferences);

			window.addEventListener("keydown", function(e) {
				//Move selection up/down
				if([38,40].indexOf(e.keyCode) > -1) {
					e.preventDefault();

					if(e.keyCode == 40) { //ArrowDown
						me.selectedRowIndex = Math.min(me.selectedRowIndex+1, me.games.length-1);
					} else {
						me.selectedRowIndex = Math.max(me.selectedRowIndex-1, 0);
					}
				}
					/**
					 * keymap: {
							ArrowUp: 38,
							ArrowLeft: 37,
							ArrowDown: 40,
							ArrowRight: 39,
							0: 96,
							1: 97,
							2: 98,
							3: 99,
							4: 100,
							5: 101,
							6: 102,
							7: 103,
							8: 104,
							9: 105,
							`: 192,
							-: 109,
							=: 187,
							Backspace: 8,
							Tab: 9,
							q: 81,
							w: 87,
							e: 69,
							r: 82,
							t: 84,
							y: 89,
							u: 85,
							i: 73,
							o: 79,
							p: 80,
							[: 219,
							]: 221,
							\: 220,
							a: 65,
							s: 83,
							d: 68,
							f: 70,
							g: 71,
							h: 72,
							j: 74,
							k: 75,
							l: 76,
							;: 186,
							': 222,
							z: 90,
							x: 88,
							c: 67,
							v: 86,
							b: 66,
							n: 78,
							m: 77,
							,: 188,
							.: 110,
							/: 111,
							: 32,
							*: 106,
							+: 107,
							Enter: 13
						}
					*/
			}, false);
		},
		watch: {
			selectedRowIndex() {
				this.$emit('gameSelected', this.games[this.selectedRowIndex]);
			},
			pagination() {
				this.loadGameListDatabase();
			}
		},
		methods: {
			onRowClick(index) {
				this.selectedRowIndex = index;
			},
			onRefreshClick() {
				this.loading = true;
				this.loadGameListDatabase();
			},
			onGetPreferences(e, preferences) {
				this.appDataDir = preferences.data.appDataDir;
				this.loadGameListDatabase();
			},
			loadGameListDatabase() {
				let me = this,
					sortBy = me.pagination.sortBy,
					descending = me.pagination.descending ? -1 : 1,
					rowsPerPage = me.pagination.rowsPerPage,
					sortObj = {},
					appData = Path.join(me.appDataDir, 'gameList.db'),
					db = new Nedb({
						autoload: true,
						filename: appData
					});
				
				if(!me.appDataDir) {
					me.$electron.ipcRenderer.send('getPreferences');
					return;
				}

				//Use stupid switch because the property cannot be substituted...
				switch(sortBy) {
					case 'name':
						sortObj.name = descending;
						break;
					case 'filename':
						sortObj.filename = descending;
						break;
					case 'system':
						sortObj.system = descending;
						break;
					case 'playCount':
						sortObj.playCount = descending;
						break;
					case 'playTime':
						sortObj.playTime = descending;
						break;
					case 'ratingCount':
					sortObj.ratingCount = descending;
						break;
					case 'overallRating':
						sortObj.overallRating = descending;
						break;
					case 'year':
						sortObj.year = descending;
						break;
					case 'manufacturer':
						sortObj.manufacturer = descending;
						break;
					case 'notes':
						sortObj.notes = descending;
						break;
					default:
						sortObj.name = descending;
						break;
				}

				db.find({})
					.sort(sortObj)
					.exec(function(err, records) {
						me.onGameListLoaded(err, records);
					});
			},
			onGameListLoaded(err, records) {
				this.loading = false;
				if(err) {
					throw err;
				}
				this.selectedRowIndex = 0;
				this.games = records || [];
				this.$emit('gameSelected', this.games[this.selectedRowIndex]);
			}
		},
		data: () => ({
			appDataDir: '',
			selectedRowIndex: 0,
			games: [],
			loading: true,
			pagination: {
				sortBy: 'name',
				descending: false,
				rowsPerPage: -1
			},
			headers: [
				{text: 'Name', value: 'name'},
				{text: 'System', value: 'system'},
				{text: 'Play Count', value: 'playCount'},
				{text: 'Rating Count', value: 'ratingCount'},
				{text: 'Positive Rating', value: 'overallRating'},
				{text: 'Total Playtime', value: 'playTime'}
			]
		})
	}
</script>

<style scoped>
	tr.row-selected td {
		background-color: rgba(var(--secondary-rgb), 0.6);
	}

	tr.row-selected:hover td {
		background-color: rgba(var(--secondary-rgb), 1);
	}
</style>