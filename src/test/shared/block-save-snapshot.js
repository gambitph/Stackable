import { createAttributeValues, getDefaultAttributes } from '@stackable/test/helpers'
import { getSaveElement } from '@wordpress/blocks'

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
		const savedElement = getSaveElement( blockSettings, defaultAttributes )

		expect( savedElement ).toMatchSnapshot()
	} )

	if ( blockSettings.attributes ) {
		test( 'saved block HTML shouldn\'t change', () => {
			const attributes = {
				...createAttributeValues( blockSettings.attributes ),
				...attributeValuesOverride,
			}
			const savedElement = getSaveElement( blockSettings, attributes )

			expect( savedElement ).toMatchSnapshot()
		} )
	}
}

export default blockSaveSnapshotTests
