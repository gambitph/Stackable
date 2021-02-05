/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

const withStyles = styleObject => createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<WrappedComponent { ...props } blockStyles={ styleObject( props ) } />
		)
	},
	'withStyles'
)

export default withStyles
