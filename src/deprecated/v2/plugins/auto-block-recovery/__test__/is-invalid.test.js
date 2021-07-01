import { isInvalid } from '../is-invalid'

import {
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks'
import { createBlockWithFallback } from '@wordpress/blocks/build/api/parser'

describe( 'isInvalid', () => {
	beforeEach( () => {
		console.warn = jest.fn() // eslint-disable-line no-console
		console.error = jest.fn() // eslint-disable-line no-console
	} )

	it( 'should not affect errors outside the allowed tags', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><style>test</style><p attr="value">test</p></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test</style><p attr="value">changed</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'style', 'svg' ] ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test</style><p attr="value2">test</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'style', 'svg' ] ) ).toBe( false )

		const block3 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<aside class="ugb-dummy"><div class="ugb-main-block"><style>test</style><p attr="value2">test</p></div></aside>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block3, [ 'style', 'svg' ] ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should affect errors from the <style> tag', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><style>test</style><p attr="value">test</p></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test2</style><p attr="value">changed</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'style', 'p' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test</style><p attr="value">changed</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'style', 'p' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should not affect non-Stackable blocks', () => {
		const blockSettings = {
			category: 'common',
			save: () => <style>test</style>,
			title: 'Test Block',
		}

		registerBlockType( 'core/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'core/dummy',
			innerHTML: '<style>test2</style>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block ) ).toBe( false )

		unregisterBlockType( 'core/dummy' )
	} )

	it( 'should affect only Stackable blocks', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><style>test</style></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test2</style></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should only affect invalid blocks', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><style>test</style></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test</style></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect invalid blocks even if nested', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block">test<div className="ugb-dummy2"><div className="ugb-main-block"><aside>test</aside></div></div></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block">test<div class="ugb-dummy2"><div class="ugb-main-block"><aside>changed</aside></div></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'aside' ] ) ).toBe( true )
		expect( isInvalid( block, [ 'div' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block">test<div class="ugb-dummy2"><div class="ugb-main-block"><aside class="test">test</aside></div></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'aside' ] ) ).toBe( true )
		expect( isInvalid( block2, [ 'div' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing style tags', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><style>test</style><p attr="value">test</p></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><p attr="value2">test</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1, [ 'style', 'svg' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><aside></aside><style>test</style><p attr="value2">test</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'style', 'svg' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect added style tags', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><p attr="value">test</p></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>test</style><p attr="value2">test</p></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1, [ 'style', 'svg' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing ugb- classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><div className="test ugb-class1 ugb-class2"><p attr="value">test</p></div></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="test ugb-class1"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="test ugb-class1 ugb-class2 ugb-class3"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( true )

		const block3 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="test ugb-class1 ugb-class-new"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block3 ) ).toBe( true )

		const block4 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="test ugb-class1 ugb-class2 added-class"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block4 ) ).toBe( false )

		const block5 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="test ugb-class1 ugb-class2"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block5 ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing image classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><div className="ugb-image wp-image-123"><p attr="value">test</p></div></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="ugb-image wp-image-123"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="ugb-image"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect changed wp image classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><div className="ugb-image wp-image-123"><p attr="value">test</p></div></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="ugb-image wp-image-123"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="ugb-image wp-image-456"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect rearranged styles', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<style>
							{ [
								'.ugb-dummy { color: #fff; }',
								'.ugb-main-block { color: #fff; }',
							].join( ' ' ) }
						</style>
					test
					</div>
				</div>
			),
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>.ugb-main-block { color: #fff; } .ugb-dummy { color: #fff; }</style>test</div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect added styles', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<style>
							{ [
								'.ugb-dummy { color: #fff; }',
								'.ugb-main-block { color: #fff; }',
							].join( ' ' ) }
						</style>
					test
					</div>
				</div>
			),
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><style>.ugb-dummy { color: #fff; }</style>test</div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing data-video attribute', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<div data-video="test">
							test
						</div>
					</div>
				</div>
			),
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div>test</div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing aria-hidden attribute', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<div aria-hidden="true">
							test
						</div>
					</div>
				</div>
			),
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div>test</div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing focusable attribute', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<div focusable="true">
							test
						</div>
					</div>
				</div>
			),
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div>test</div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect added image classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-dummy"><div className="ugb-main-block"><div className="ugb-image"><p attr="value">test</p></div></div></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-dummy"><div class="ugb-main-block"><div class="ugb-image wp-image-123"><p attr="value">test</p></div></div></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )
} )
