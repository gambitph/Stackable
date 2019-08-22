/**
 * Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
 * Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
 * TODO: Remove tests that use this!
 */
/**
 * External dependencies
 */
import { createAttributeValues, getDefaultAttributes } from '~stackable/test/helpers'
import registerStackableBlock from '~stackable/register-block'

/**
 * WordPress dependencies
 */
import {
	createBlock,
	getBlockTypes,
	getSaveContent,
	parse,
	registerBlockType,
	serialize,
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
		defaultAttributes: defaultAttributesOverride = {},
		attributes: attributeValuesOverride = {},
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
			const testBlockName = 'core/test-block'
			const testBlockSettings = {
				save: () => <div>Test Block</div>,
				category: 'common',
				title: 'Test Block',
			}
			registerBlockType( testBlockName, testBlockSettings )

			const savedHTML = serialize( createBlock( testBlockName, {} ) )

			innerBlocks.push( createBlock( testBlockName ) )
			innerBlocksFallbackArgs.push( {
				blockName: testBlockName,
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
		const defaultAttributes = {
			...getDefaultAttributes( name, blockSettings ),
			...defaultAttributesOverride,
		}

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

		// registerBlockType( name, blockSettings )
		registerStackableBlock( name, blockSettings )

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
	if ( blockSettings.attributes ) {
		test( 'should be able to edit the block, after saving with values', () => {
			const attributes = {
				...createAttributeValues( blockSettings.attributes ),
				...attributeValuesOverride,
			}

			// registerBlockType( name, blockSettings )
			registerStackableBlock( name, blockSettings )

			const createdBlock = createBlock( name, attributes )
			const savedHTML = serialize( createdBlock )
			const block = parse( savedHTML )[ 0 ]

			expect( block.name ).toEqual( name )
			expect( block.isValid ).toBe( true )
			expect( block.attributes ).toEqual( attributes )
		} )
	}
}

export default blockEditableAfterSaveTests
