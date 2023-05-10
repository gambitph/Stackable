/**
 * Internal dependencies
 */
import BlockHighlighter from './block-highlight'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	createContext, useContext, useEffect,
} from '@wordpress/element'
import { useRafState } from '~stackable/hooks'

const BlockHighlightContext = createContext( null )

export const useBlockHighlightContext = () => {
	return useContext( BlockHighlightContext )
}

const withBlockHighlightContext = createHigherOrderComponent(
	WrappedComponent => props => {
		const uniqueId = props.attributes.uniqueId
		const [ highlightStyles, setHighlightStyles ] = useRafState( null )

		useEffect( () => {
			if ( highlightStyles ) {

			}
		}, [ highlightStyles ] )

		useEffect( () => {
			if ( ! props.isSelected ) {
				setHighlightStyles( null )
			}
		}, [ props.isSelected ] )

		return (
			<BlockHighlightContext.Provider value={ setHighlightStyles }>
				{ highlightStyles && <BlockHighlighter uniqueId={ uniqueId } { ...( highlightStyles || {} ) } /> }
				<WrappedComponent { ...props } />
			</BlockHighlightContext.Provider>
		)
	},
	'withBlockHighlightContext'
)

export default withBlockHighlightContext

