<template>
	<span>
		<v-data-table hide-actions
			:headers="headers"
			:items="items">
			<template slot="items" slot-scope="props">
				<tr :class="{'row-selected': selectedRowIndex == props.index}"
					@click="onRowClick(props.index)">
					<td>{{ props.item.label }}</td>
					<td>{{ props.item.system }}</td>
					<td>{{ props.item.playCount }}</td>
					<td>{{ props.item.playTime }}</td>
					<td>
						<v-rating half-increments dense readonly
							:value="props.item.rating"></v-rating>
					</td>
				</tr>
			</template>
		</v-data-table>
	</span>
</template>

<script>
	export default {
		name: 'grid',
			mounted() {
				var me = this;
				window.addEventListener("keydown", function(e) {
					//Move selection up/down
					if([38,40].indexOf(e.keyCode) > -1) {
						e.preventDefault();

						if(e.keyCode == 40) { //ArrowDown
							me.selectedRowIndex = Math.min(me.selectedRowIndex+1, me.items.length-1);
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
			data: () => ({
				selectedRowIndex: 0,
				headers: [
						{text: 'Name', value: 'label'},
						{text: 'System', value: 'system'},
						{text: 'Play Count', value: 'playCount'},
						{text: 'Total Playtime', value: 'playTime'},
						{text: 'Rating', value: 'rating'}
					],
					items: [{
						label: 'Frozen Yogurt',
						system: 'N64',
						playTime: '02:30',
						playCount: 0,
						rating: 1.5,
						selected: true
					}, {
						label: 'Pudding',
						system: 'SNES',
						playTime: '0:30',
						playCount: 5,
						rating: 0,
						selected: false
					}]
			}),
			methods: {
				onRowClick(clickedIndex) {
					this.selectedRowIndex = clickedIndex;
				}
			}
	}
</script>

<style scoped>
	.v-datatable.v-table tr.row-selected {
		background-color: rgba(var(--accent-rgb), 0.6);
	}

	.v-datatable.v-table tr.row-selected:hover {
		background-color: rgba(var(--accent-rgb), 1);
	}
</style>