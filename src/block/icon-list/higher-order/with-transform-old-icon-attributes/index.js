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

/**
 * HOC for changing the icon attributes for Icon List Blocks in <=2.9.1
 *
 * @since 2.9.1
 */
const withTransformOldIconAttributes = createHigherOrderComponent(
	WrappedComponent => props => {
		const {
			icon,
			iconShape,
		} = props.attributes

		if ( icon ) {
			props.attributes.icon = updateIconAttribute( icon, iconShape )
			range( 1, 7 ).forEach( index => {
				props.attributes[ `icon${ index }` ] = ! props.attributes[ `icon${ index }` ] ? updateIconAttribute( icon, iconShape ) : props.attributes[ `icon${ index }` ]
			} )

			// Unset the icon attribute
			props.attributes.icon = undefined
		}

		return <WrappedComponent { ...props } />
	},
	'withTransformOldIconAttributes'
)

export default withTransformOldIconAttributes

