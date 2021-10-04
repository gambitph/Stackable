/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { createContext } from '@wordpress/element'

/**
 * Context used by the Columns block to apply a class that
 */
export const QueryLoopContext = createContext( null )

const withQueryLoopContext = createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<QueryLoopContext.Provider value={ props.context } >
				<WrappedComponent { ...props } />
			</QueryLoopContext.Provider>
		)
	},
	'withQueryLoopContext'
)

export default withQueryLoopContext
