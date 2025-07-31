/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockStyleProvider } from '~stackable/hooks'

const withBlockStyleContext = blockStyles => createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<BlockStyleProvider
				blockStyles={ blockStyles }
				clientId={ props.clientId }
				context={ props.context }
			>
				<WrappedComponent { ...props } />
			</BlockStyleProvider>
		)
	},
	'withBlockStyleContext'
)

export default withBlockStyleContext
