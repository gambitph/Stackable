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

	it( 'should not affect errors outside the <style> tag', () => {
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

		expect( isInvalid( block ) ).toBe( false )

		const block2 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><style>test</style><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block2 ) ).toBe( false )

		const block3 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<aside><style>test</style><p attr="value2">test</p></aside>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block3 ) ).toBe( false )

		const block4 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block4 ) ).toBe( false )

		const block5 = createBlockWithFallback( {
			blockName: 'ugb/dummy',
			innerHTML: '<div><aside></aside><style>test</style><p attr="value2">test</p></div>',
			attrs: {},
			innerBlocks: [],
		} )

		expect( isInvalid( block5 ) ).toBe( false )

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

		expect( isInvalid( block ) ).toBe( true )

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
} )
