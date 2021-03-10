import { isInvalid, getInequivalentHTMLError } from '../is-invalid'

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
			save: () => <div><style>test</style><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test</style><p attr="value">changed</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'style', 'svg' ] ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test</style><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'style', 'svg' ] ) ).toBe( false )

		const block3 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<aside><style>test</style><p attr="value2">test</p></aside>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block3, [ 'style', 'svg' ] ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should affect errors from the <style> tag', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div><style>test</style><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test2</style><p attr="value">changed</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'style', 'p' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test</style><p attr="value">changed</p></div>',
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
			save: () => <style>test</style>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<style>test2</style>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should only affect invalid blocks', () => {
		const blockSettings = {
			category: 'common',
			save: () => <style>test</style>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<style>test</style>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect invalid blocks even if nested', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div>test<aside>test</aside></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div>test<aside>changed</aside></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block, [ 'aside' ] ) ).toBe( true )
		expect( isInvalid( block, [ 'div' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div>test<aside class="test">test</aside></div>',
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
			save: () => <div><style>test</style><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1, [ 'style', 'svg' ] ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><aside></aside><style>test</style><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2, [ 'style', 'svg' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect added style tags', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test</style><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1, [ 'style', 'svg' ] ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing ugb- classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="test ugb-class1 ugb-class2"><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="test ugb-class1"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="test ugb-class1 ugb-class2 ugb-class3"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( true )

		const block3 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="test ugb-class1 ugb-class-new"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block3 ) ).toBe( true )

		const block4 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="test ugb-class1 ugb-class2 added-class"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block4 ) ).toBe( false )

		const block5 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="test ugb-class1 ugb-class2"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block5 ) ).toBe( false )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing image classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-image wp-image-123"><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-image wp-image-123"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-image"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect added image classes', () => {
		const blockSettings = {
			category: 'common',
			save: () => <div className="ugb-image"><p attr="value">test</p></div>,
			title: 'Test Block',
		}

		registerBlockType( 'ugb/dummy', blockSettings )

		const block1 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div class="ugb-image wp-image-123"><p attr="value">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block1 ) ).toBe( true )

		unregisterBlockType( 'ugb/dummy' )
	} )

	it( 'should detect missing important in styles', () => {
		const blockSettings = {
			category: 'common',
			save: () => (
				<div className="ugb-dummy">
					<div className="ugb-main-block">
						<style>
							{ [
								'.ugb-main-block { color: #fff; } !important',
								'.ugb-dummy { color: #fff; } !important',
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
} )

describe( 'getInequivalentHTMLError', () => {
	it( 'should return false if no error', () => {
		expect( getInequivalentHTMLError( '<div>test</div>', '<div>test</div>' ) ).toBe( false )
		expect( getInequivalentHTMLError( '<div><footer/>test</div><style>test</style>', '<div><footer/>test</div><style>test</style>' ) ).toBe( false )
		expect( getInequivalentHTMLError( '', '' ) ).toBe( false )
	} )
	it( 'should return the html tag tree where the error occurred', () => {
		expect( getInequivalentHTMLError( '<aside>test</aside>', '<aside>test2</aside>' ) ).toEqual( [ 'aside' ] )
		expect( getInequivalentHTMLError( '<aside><div></div></aside>', '<aside><div class="test"></div></aside>' ) ).toEqual( [ 'aside', 'div' ] )
		expect( getInequivalentHTMLError( '<aside><div></div><style>test</style></aside>', '<aside><div></div><style>test2</style></aside>' ) ).toEqual( [ 'aside', 'style' ] )
		expect( getInequivalentHTMLError( '<aside><div></div></aside><style>test</style>', '<aside><div></div></aside><style>test2</style>' ) ).toEqual( [ 'style' ] )
		expect( getInequivalentHTMLError( '<aside><div/><style>test</style></aside>', '<aside><div/><style>test2</style></aside>' ) ).toEqual( [ 'aside', 'style' ] )
		expect( getInequivalentHTMLError( '<aside><div class="test"/><style>test</style></aside>', '<aside><div class="test2"/><style>test</style></aside>' ) ).toEqual( [ 'aside', 'div' ] )
	} )
} )
