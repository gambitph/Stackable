/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * Internal dependencies
 */
import { updateIconAttribute } from '../../util'

/**
 * External dependencies
 */
import { range } from 'lodash'

// Change the icon attributes from Icon List Blocks in <=2.9.1
const withTransformOldIconAttributes = createHigherOrderComponent(
	WrappedComponent => props => {
		const {
			icon,
			iconShape,
		} = props.attributes

		props.attributes.icon = updateIconAttribute( icon, iconShape )
		range( 1, 7 ).forEach( index => {
			props.attributes[ `icon${ index }` ] = updateIconAttribute( icon, iconShape )
		} )

		return <WrappedComponent { ...props } />
	},
	'withTransformOldIconAttributes'
)

export default withTransformOldIconAttributes

