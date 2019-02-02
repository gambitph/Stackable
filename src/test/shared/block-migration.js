/**
 * Checks whether saved HTML of older versioned blocks would migrate and remain valid & editable.
 * Checks whether saved HTML of older versioned blocks with changed values, would migrate and remain valid & editable.
 */

import { createAttributeValues, getDefaultAttributes } from '@stackable/test/helpers'
import {
	createBlock,
	getBlockTypes,
	getSaveContent,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks'
import { createBlockWithFallback } from '@wordpress/blocks/build/api/parser'

// @see https://blog.revathskumar.com/2018/07/jest-shared-tests.html
const blockMigrationTests = function( props ) {
	const {
		name,
		settings,
		save,
		deprecated,
		attributeValuesOverride = {},
		hasInnerBlocks = false,
	} = props

	const blockSettings = {
		...settings,
		category: 'common',
		save,
		deprecated,
	}

	const innerBlocks = []
	const innerBlocksFallbackArgs = []

	beforeEach( () => {
		if ( hasInnerBlocks ) {
			const testBlockSettings = {
				save: () => <div>Test Block</div>,
				category: 'common',
				title: 'Test Block',
			}
			registerBlockType( 'core/test-block', testBlockSettings )

			const savedHTML = getSaveContent( {
				...testBlockSettings,
				name: 'core/test-block',
			}, {} )

			innerBlocks.push( createBlock( 'core/test-block' ) )
			innerBlocksFallbackArgs.push( {
				blockName: 'core/test-block',
				innerHTML: savedHTML,
				attrs: {},
			} )
		}
	} )

	afterEach( () => {
		getBlockTypes().forEach( block => {
			unregisterBlockType( block.name )
		} )
	} )

	// Checks whether saved HTML of older versioned blocks would migrate and remain valid & editable.
	deprecated.forEach( ( deprecate, i ) => {
		test( `should migrate deprecated blocks. Deprecation ${ i + 1 }/${ deprecated.length }`, () => {
			// Get the default attributes of the deprecated block.
			const defaultAttributes = getDefaultAttributes( name, {
				...settings,
				category: 'common',
				save: deprecate.save,
				attributes: deprecate.attributes,
			} )

			// Mimick saving, get the saved html.
			const savedDeprecatedHTML = getSaveContent(
				{
					...settings,
					category: 'common',
					name,
					save: deprecate.save,
					attributes: deprecate.attributes,
				},
				defaultAttributes,
				// innerBlocks
			)

			// Register the latest block.
			registerBlockType( name, blockSettings )

			// Migrate the old saved block into the new block.
			const block = createBlockWithFallback( {
				blockName: name,
				innerHTML: savedDeprecatedHTML,
				attrs: defaultAttributes,
				innerBlocks: innerBlocksFallbackArgs,
			} )

			// Should work.
			expect( block.name ).toEqual( name )
			expect( block.isValid ).toBe( true )

			// Gutenberg WILL throw an error.
			expect( console ).toHaveErrored()
			expect( console ).toHaveWarned()
		} )
	} )

	// Checks whether saved HTML of older versioned blocks would migrate and remain valid & editable.
	deprecated.forEach( ( deprecate, i ) => {
		test( `should migrate deprecated blocks with values. Deprecation ${ i + 1 }/${ deprecated.length }`, () => {
			// Get the default attributes of the deprecated block.
			const attributes = {
				...createAttributeValues( deprecate.attributes ),
				...attributeValuesOverride,
			}

			// Mimick saving, get the saved html.
			const savedDeprecatedHTML = getSaveContent(
				{
					...settings,
					category: 'common',
					name,
					save: deprecate.save,
					attributes: deprecate.attributes,
				},
				attributes,
				// innerBlocks
			)

			// Register the latest block.
			registerBlockType( name, blockSettings )

			// Migrate the old saved block into the new block.
			const block = createBlockWithFallback( {
				blockName: name,
				innerHTML: savedDeprecatedHTML,
				attrs: attributes,
				innerBlocks: innerBlocksFallbackArgs,
			} )

			// Should work.
			expect( block.name ).toEqual( name )
			expect( block.isValid ).toBe( true )

			// Gutenberg WILL throw an error.
			expect( console ).toHaveErrored()
			expect( console ).toHaveWarned()
		} )
	} )
}

export default blockMigrationTests
