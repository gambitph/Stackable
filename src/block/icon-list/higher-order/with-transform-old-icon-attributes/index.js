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
 * @since 2.10.0
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
				const iconEntry = props.attributes[ `icon${ index }` ]
				props.attributes[ `icon${ index }` ] = ! iconEntry ? updateIconAttribute( icon, iconShape ) : updateIconAttribute( iconEntry, iconShape )
			} )
		}

		return <WrappedComponent { ...props } />
	},
	'withTransformOldIconAttributes'
)

export default withTransformOldIconAttributes

