<!-- eslint-disable vue/require-v-for-key -->
<template>
	<template v-for="(row, x) in props.grid">
		<div class="row">
			<template v-for="(letter, y) in row">
				<label
					:for="`crossword-cell-${x}-${y}`"
				>
					<span class="screenreader-only">
						Coordinate {{ x }}, {{ y }}
					</span>
					<input
						:id="`crossword-cell-${x}-${y}`"
						type="text"
						maxlength="1"
						oninput="crosswordCellInput(this)"
						onfocus="crosswordCellFocused(this)"
						onblur="crosswordCellBlurred(this)"
						:disabled="isEmptyTile(x, y)"
						:data-x="x"
						:data-y="y"
						:data-answer="letter"
						:data-across="findDownNumber(x, y)"
						:data-down="findAcrossNumber(x, y)"
					>
					<span
						v-if="isStartOfAcross(x, y) || isStartOfDown(x, y)"
						class="cell-number"
						aria-hidden="true"
					>
						{{ getClueNumber(x, y) }}
					</span>
				</label>
			</template>
		</div>
	</template>
</template>

<script setup>
	// eslint-disable-next-line no-undef
	const props = defineProps({ grid: Array })
	
	const isEmptyTile = (x, y) => (props.grid[x][y] == '#')
	const isUndefined = (x, y) => (props.grid[x] == undefined || props.grid[x][y] == undefined)
	const isOutOfBounds = (x, y) => (isUndefined(x, y) || isEmptyTile(x, y))
	const isStartOfAcross = (x, y) => (isOutOfBounds(x - 1, y) && !isOutOfBounds(x + 1, y) && !isOutOfBounds(x, y))
	const isStartOfDown = (x, y) => (isOutOfBounds(x, y - 1) && !isOutOfBounds(x, y + 1) && !isOutOfBounds(x, y))


	let acrossClueNumberGrid = props.grid.map(row => row.replace(/[A-Za-z]/g, ' ').split(''))
	let downClueNumberGrid = props.grid.map(row => row.replace(/[A-Za-z]/g, ' ').split(''))
	let currentClue = 1
	const getNextClue = () => currentClue++

	props.grid.forEach((row, x) => {
		row.split('').forEach((_, y) => {
			if (isStartOfAcross(x, y) && isStartOfDown(x, y)) {
				const clueNumber = getNextClue()
				acrossClueNumberGrid[x][y] = clueNumber
				downClueNumberGrid[x][y] = clueNumber
			}
			else if (isStartOfAcross(x, y)) {
				const clueNumber = getNextClue()
				acrossClueNumberGrid[x][y] = clueNumber
			}
			else if (isStartOfDown(x, y)) {
				const clueNumber = getNextClue()
				downClueNumberGrid[x][y] = clueNumber
			}
		})
	})

	const getClueNumber = (x, y) => acrossClueNumberGrid[x][y] == ' '
		? downClueNumberGrid[x][y] 
		: acrossClueNumberGrid[x][y]


	const findAcrossNumber = (x, y) => {
		if (isOutOfBounds(x, y)) {
			return '#'
		}
		else if (acrossClueNumberGrid[x][y] == ' ') {
			return findAcrossNumber(x - 1, y)
		}
		else {
			return acrossClueNumberGrid[x][y]
		}
	}

	const findDownNumber = (x, y) => {
		if (isOutOfBounds(x, y)) {
			return '#'
		}
		else if (downClueNumberGrid[x][y] == ' ') {
			return findDownNumber(x, y - 1)
		}
		else {
			return downClueNumberGrid[x][y]
		}
	}
</script>

<style scoped>
	/* eslint-disable-next-line vue-scoped-css/no-unused-selector */
	input
	{
		background: var(--foreground);
		color: var(--background);

		font-family: var(--tekst-mono);
		font-size: 2rem;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		
		width: 2ch;
		height: 2ch;
		line-height: 2ch;
		text-align: center;
		border: none;
		outline: none;
		pointer-events: all;

		cursor: pointer;
		caret-color: transparent;
		user-select: all;
		box-shadow: inset 0 0 0 1px var(--background);
	
		&.incorrect
		{
			background: var(--red);
		}

		&.highlight
		{
			background: #e0c18d;
		}

		&::selection
		{
			background: transparent;
		}

		&:focus
		{
			background: var(--yellow);
		}

		&[disabled]
		{
			background: var(--background);
			cursor: default;
		}
	}

	label
	{
		position: relative;
		pointer-events: none;
	}

	.cell-number
	{
		position: absolute;
		top: -15px;
		left: 3px;

		font-family: var(--tekst-mono);
		font-size: 0.8rem;
		color: var(--background);
		user-select: none;
	}
</style>