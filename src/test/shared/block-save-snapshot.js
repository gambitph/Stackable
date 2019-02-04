import { createAttributeValues, getDefaultAttributes } from '@stackable/test/helpers'
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
