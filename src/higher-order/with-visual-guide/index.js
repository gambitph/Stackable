/**
 * Internal dependencies
 */
import VisualGuideer from './visual-guide'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	createContext, useContext, useEffect,
} from '@wordpress/element'
import classNames from 'classnames'
import { useRafState } from '~stackable/hooks'

const VisualGuideContext = createContext( null )

export const useVisualGuideContext = () => {
	return useContext( VisualGuideContext )
}

const withVisualGuideContext = createHigherOrderComponent(
	WrappedComponent => props => {
		const uniqueId = props.attributes.uniqueId
		const [ highlightStyles, setHighlightStyles ] = useRafState( null )

		useEffect( () => {
			if ( ! props.isSelected ) {
				setHighlightStyles( null )
			}
		}, [ props.isSelected ] )

		return (
			<VisualGuideContext.Provider value={ setHighlightStyles }>
				{ highlightStyles && <VisualGuideer uniqueId={ uniqueId } { ...( highlightStyles || {} ) } /> }
				<WrappedComponent
					className={ classNames(
						props.className,
						{ 'stk-has-visual-guide': !! highlightStyles }
					) }
					{ ...props }
				/>
			</VisualGuideContext.Provider>
		)
	},
	'withVisualGuideContext'
)

export default withVisualGuideContext

