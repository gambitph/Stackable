/**
 * Snapshot for saved html with default attributes shouldn't change
 * Snapshot for saved html with modified attributes shouldn't change
 * TODO: Remove tests that use this!
 */
/**
 * External dependencies
 */
import { createAttributeValues, getDefaultAttributes } from '~stackable/test/helpers'

/**
 * WordPress dependencies
 */
import { getSaveElement } from '@wordpress/blocks'
import TestRenderer from 'react-test-renderer'

const blockSaveSnapshotTests = function( props ) {
	const {
		name,
		settings,
		save = null,
		deprecated = null,
		attributes: attributeValuesOverride = {},
	} = props

	const blockSettings = {
		...settings,
		name,
		category: 'common',
		save,
		deprecated,
	}

	test( 'saved default block HTML shouldn\'t change', () => {
		const defaultAttributes = getDefaultAttributes( name, blockSettings )
		const savedElement = TestRenderer.create(
			getSaveElement( blockSettings, defaultAttributes )
		).toJSON()

		expect( savedElement ).toMatchSnapshot()
	} )

	if ( blockSettings.attributes ) {
		test( 'saved block HTML shouldn\'t change', () => {
			const attributes = {
				...createAttributeValues( blockSettings.attributes, settings ),
				...attributeValuesOverride,
			}
			const savedElement = TestRenderer.create(
				getSaveElement( blockSettings, attributes )
			).toJSON()

			expect( savedElement ).toMatchSnapshot()
		} )
	}
}

export default blockSaveSnapshotTests
