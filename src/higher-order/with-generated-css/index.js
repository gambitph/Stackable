/**
 * Internal	dependencies
 */
import { useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

const cachedBlockAttributes = {}

const withGeneratedCss = createHigherOrderComponent(
	WrappedComponent => props => {
		const { clientId } = useBlockEditContext()
		const attributes = useBlockAttributes( clientId )
		const { getSelectedBlock } = useSelect( 'core/block-editor' )

		// If the block is selected, don't use the generated CSS.
		if ( attributes.generatedCss && getSelectedBlock()?.clientId === clientId ) {
			delete cachedBlockAttributes[ clientId ]
			attributes.generatedCss = ''
		}

		// If the generated CSS attribute is detected (this means the block
		// previously exists already), then keep using those styles.
		if ( attributes.generatedCss ) {
			if ( ! cachedBlockAttributes[ clientId ] ) {
				cachedBlockAttributes[ clientId ] = attributes
				if ( attributes.generatedCss ) {
					return <style>{ attributes.generatedCss }</style>
				}
			} else if ( cachedBlockAttributes[ clientId ] === attributes ) {
				if ( attributes.generatedCss ) {
					return <style>{ attributes.generatedCss }</style>
				}
			// If the attributes have changed, then start generating the css.
			} else {
				delete cachedBlockAttributes[ clientId ]
				attributes.generatedCss = ''
			}
		}

		return (
			<WrappedComponent { ...props } />
		)
	},
	'withGeneratedCss'
)

export default withGeneratedCss
