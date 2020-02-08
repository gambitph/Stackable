/**
 * Internal dependencies
 */
import { getExpectedBlockName, validateBlockHTML } from '../util'

/**
 * WordPress dependencies
 */
import {
	getBlockTypes,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks'

describe( 'Utility functions', () => {
	describe( 'getExpectedBlockName', () => {
		test( 'should handle non-block html', () => {
			expect( getExpectedBlockName( '' ) ).toBe( '' )
			expect( getExpectedBlockName( 'abcd' ) ).toBe( '' )
			expect( getExpectedBlockName( '<div></div>' ) ).toBe( '' )
			expect( getExpectedBlockName( '<!-- -->' ) ).toBe( '' )
		} )

		test( 'should namespace core block names', () => {
			expect( getExpectedBlockName( '<!-- wp:blockname -->' ) ).toBe( 'core/blockname' )
			expect( getExpectedBlockName( '<!-- wp:core/blockname -->' ) ).toBe( 'core/blockname' )
		} )

		test( 'should get block names', () => {
			expect( getExpectedBlockName( '<!-- wp:core/blockname -->' ) ).toBe( 'core/blockname' )
			expect( getExpectedBlockName( '<!-- wp:ugb/block-name09 -->' ) ).toBe( 'ugb/block-name09' )
			expect( getExpectedBlockName( '<!--:blockname -->' ) ).toBe( 'core/blockname' )
			expect( getExpectedBlockName( '<!-- wp:ugb/blockname -->' ) ).toBe( 'ugb/blockname' )
			expect( getExpectedBlockName( '<!-- wp:ugb/bgh9726-928ban -->' ) ).toBe( 'ugb/bgh9726-928ban' )
		} )
	} )

	describe( 'validateBlockHTML', () => {
		beforeAll( () => {
			const testBlockSettings = {
				save: () => <div>Test Block</div>,
				category: 'common',
				title: 'Test Block',
			}
			registerBlockType( 'core/test-block', testBlockSettings )
		} )

		afterAll( () => {
			getBlockTypes().forEach( block => {
				unregisterBlockType( block.name )
			} )
		} )

		test( 'should handle valid', () => {
			expect( validateBlockHTML( `<!-- wp:test-block -->
<div>Test Block</div>
<!-- /wp:test-block -->` ) ).toBe( true )
		} )

		test( 'should handle unregisterd blocks', () => {
			expect( validateBlockHTML( `<!-- wp:test-block2 -->
<div>Test Block</div>
<!-- /wp:test-block -->` ) ).toBe( false )
		} )

		test( 'should handle invalid html blocks', () => {
			console.warn = jest.fn() // eslint-disable-line no-console
			console.error = jest.fn() // eslint-disable-line no-console

			expect( validateBlockHTML( `<!-- wp:test-block -->
<span>Test Block</span>
<!-- /wp:test-block -->` ) ).toBe( false )
			expect( console.warn ).toHaveBeenCalled() // eslint-disable-line no-console
			expect( console.error ).toHaveBeenCalled() // eslint-disable-line no-console
		} )
	} )
} )
