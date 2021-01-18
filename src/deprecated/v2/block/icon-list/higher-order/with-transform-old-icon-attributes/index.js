/**
 * WordPress dependencies
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
const updateIconAttribute = ( icon = '', iconShape = '' ) => {
	const updatedIcon = deprecatedIcon_2_9_1[ `${ icon }-${ iconShape || 'default' }` ] || deprecatedIcon_2_9_1[ `check-${ iconShape || 'default' }` ]
	return updatedIcon ? updatedIcon : icon
}

const withTransformOldIconAttributes = createHigherOrderComponent(
	WrappedComponent => props => {
		const {
			icon,
			iconShape,
		} = props.attributes

		// Only transform old icon attributes if we can see old values:
		// The icon is a name, and the iconShape may be present.
		if ( ( icon && ! icon.match( /^</ ) ) || iconShape ) {
			props.attributes.icon = updateIconAttribute( icon, iconShape )
			props.attributes.iconShape = undefined
		}

		return <WrappedComponent { ...props } />
	},
	'withTransformOldIconAttributes'
)

export default withTransformOldIconAttributes
