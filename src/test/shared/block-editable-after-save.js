/**
 * Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
 * Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
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
const blockEditableAfterSaveTests = function( props ) {
	const {
		name,
		settings,
		save = null,
		deprecated = null,
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

	// Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
	test( 'should be able to edit the block, after saving block defaults', () => {
		const defaultAttributes = getDefaultAttributes( name, blockSettings )

		const savedHTML = getSaveContent(
			{
				...settings,
				category: 'common',
				name,
				save,
			},
			defaultAttributes,
			// innerBlocks
		)

		registerBlockType( name, blockSettings )

		const block = createBlockWithFallback( {
			blockName: name,
			innerHTML: savedHTML,
			attrs: defaultAttributes,
			innerBlocks: innerBlocksFallbackArgs,
		} )

		expect( block.name ).toEqual( name )
		expect( block.isValid ).toBe( true )
		expect( block.attributes ).toEqual( defaultAttributes )
	} )

	// Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
	test( 'should be able to edit the block, after saving with values', () => {
		const attributes = {
			...createAttributeValues( blockSettings.attributes ),
			...attributeValuesOverride,
		}

		const savedHTML = getSaveContent(
			{
				...settings,
				category: 'common',
				name,
				save,
			},
			attributes,
			// innerBlocks
		)

		registerBlockType( name, blockSettings )

		const block = createBlockWithFallback( {
			blockName: name,
			innerHTML: savedHTML,
			attrs: attributes,
			innerBlocks: innerBlocksFallbackArgs,
		} )

		expect( block.name ).toEqual( name )
		expect( block.isValid ).toBe( true )
		expect( block.attributes ).toEqual( attributes )
	} )
}

export default blockEditableAfterSaveTests
