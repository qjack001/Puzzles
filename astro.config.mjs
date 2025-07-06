import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'

export default defineConfig({
	site: 'https://guinane.xyz/puzzles/',
	base: '/puzzles',
	integrations: [ vue() ],
})