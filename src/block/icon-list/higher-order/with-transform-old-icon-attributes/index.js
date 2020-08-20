/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * Internal dependencies
 */
import { deprecatedIcon_2_9_1 } from '../../deprecated'

/**
 * Handles icon atttribute deprecation in 2.9.1
 *
 * @param {string} icon
 * @param {string} iconShape
 *
 * @return {string} SVG String
 */
const updateIconAttribute = ( icon = '', iconShape = 'default' ) => {
	if ( ! icon ) {
		return 'fa-check'
	}
	const updatedIcon = deprecatedIcon_2_9_1[ `${ icon }-${ iconShape || 'default' }` ]
	return updatedIcon ? updatedIcon : icon
}

const withTransformOldIconAttributes = createHigherOrderComponent(
	WrappedComponent => props => {
		const {
			icon,
			iconShape,
		} = props.attributes

		props.attributes.icon = updateIconAttribute( icon, iconShape )

		return <WrappedComponent { ...props } />
	},
	'withTransformOldIconAttributes'
)

export default withTransformOldIconAttributes
