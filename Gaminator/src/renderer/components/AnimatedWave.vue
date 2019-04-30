<template>
	<div class="contain">
		<div class="row row-13">
			<div class="dot dot-12"></div>
			<div class="dot dot-11"></div>
			<div class="dot dot-10"></div>
			<div class="dot dot-9"></div>
			<div class="dot dot-8"></div>
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-12">
			<div class="dot dot-11"></div>
			<div class="dot dot-10"></div>
			<div class="dot dot-9"></div>
			<div class="dot dot-8"></div>
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-11">
			<div class="dot dot-10"></div>
			<div class="dot dot-9"></div>
			<div class="dot dot-8"></div>
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-10">
			<div class="dot dot-9"></div>
			<div class="dot dot-8"></div>
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-9">
			<div class="dot dot-8"></div>
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-8">
			<div class="dot dot-7"></div>
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-7">
			<div class="dot dot-6"></div>
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-6">
			<div class="dot dot-5"></div>
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-5">
			<div class="dot dot-4"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-4">
			<div class="dot dot-3"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-3">
			<div class="dot dot-2"></div>
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-2">
			<div class="dot dot-1"></div>
			<div class="dot dot-0"></div>
		</div>
		<div class="row row-1">
			<div class="dot dot-0"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'animated-wave'
	}
</script>

<style lang="scss" scoped>
	$rows: 13;
	$dot-size: 2vw;
	// $dot-color: ;

	.contain {
		position: relative;
		margin: 0 auto;
		height: 400px;
		// Same as row width formula
		width: $dot-size * 1.93 * $rows * (1 - 1 * .3);
	}

	.row {
		display: flex;
		justify-content: space-around;
		position: absolute;
		margin: 0 auto;
		left: 0;
		right: 0;
		animation-duration: 1.81s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}

	.dot {
		border-radius: 50%;
		// background: rgba(var(--primary-rgb), 1);
	}

	$i: 1;
	@while $i <= $rows{
		$scale: $i / $rows;
		
		.row-#{$i} {
			// Small (ugly) tweak to make all rows vertically centered
			top: 200px + $i;
			width: $dot-size * 1.93 * $i * (1 - $scale * .3);
			animation-delay: 120ms * $i - ($rows * 180ms);
			animation-name: wave-#{$i};
		}

		.row-#{$i} .dot {
			// background: hsl(0, 0%, 100% * $scale * .7);
			background: rgba(var(--primary-rgb), 1-(1*$scale*.6));
			height: $dot-size * (1 - $scale * 0.7);
			width: $dot-size * (1 - $scale * 0.7);
		}
		
		@keyframes wave-#{$i} {
			$scale: ($i) / $rows;
			$wave-height: 130px;
			$max-offset: 40;
			from {
				transform: translateY($wave-height - $max-offset * $scale);
			}
			to {
				transform: translateY(-1 * $wave-height + $max-offset * $scale);
			}
		}
		
		$i: $i + 1;
	}
</style>