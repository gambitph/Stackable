/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockStyleProvider } from '~stackable/hooks'
import { useRef } from '@wordpress/element'

const withBlockStyleContext = blockStyles => createHigherOrderComponent(
	WrappedComponent => props => {
		const editCss = useRef( '' )

		return (
			<BlockStyleProvider
				blockStyles={ blockStyles }
				editCss={ editCss }
				blockState={ props.blockState }
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
