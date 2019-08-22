/**
 * External dependencies
 */
import { getBlockModifiedAttributes } from '~stackable/test/helpers'

const blockStyleTests = props => {
	const {
		settings,
		name,
		attributes = {}, // Overridden attributes for testing.
		createStyles = () => {},
	} = props

	test( 'should match snapshot', () => {
		expect( createStyles( { attributes } ) ).toMatchSnapshot()
	} )

	test( 'should match snapshot with modified attributes', () => {
		const blockProps = {
			attributes: getBlockModifiedAttributes( name, settings, attributes ),
		}

		expect( createStyles( blockProps ) ).toMatchSnapshot()
	} )
}

export default blockStyleTests

