/**
 * This is used so we can have access to attributes and the setAttributes method
 * anywhere across the entire block/inspector.
 *
 * WordPress can already uses its own context for select( 'core/block-editor'
 * ).getBlockAttributes( clientId ) but that method isn't optimized and produces
 * unnecessary re-renders. This HOC will allow us to useBlockAttributesContext
 * and use a selector for attributes.
 */

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockAttributesProvider } from '~stackable/hooks'

const withBlockAttributeContext = createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<BlockAttributesProvider { ...props }>
				<WrappedComponent { ...props } />
			</BlockAttributesProvider>
		)
	},
	'withBlockAttributeContext'
)

export default withBlockAttributeContext
