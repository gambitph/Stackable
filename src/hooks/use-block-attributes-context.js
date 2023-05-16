/**
 * Use this more performant context instead of using the select/dispatch
 * provided by WordPress.
 *
 * This is used by all our blocks to pass down the attributes of the block to
 * whatever inner component needs it (e.g. typography controls). The inner
 * components can then use the 2 contexts here to use or set the attributes in a
 * more performant manner (because of context selectors)
 */

/**
 * Internal dependencies
 */
import { createContext as createContextSelector, useContextSelector } from './use-context-selector'

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element'

export const DEFAULT_BLOCK_ATTRIBUTES_CONTEXT = {}
export const DEFAULT_SET_ATTRIBUTES_CONTEXT = () => {}
export const DEFAULT_BLOCK_CONTEXT_CONTEXT = {}

const AttributesContext = createContextSelector( DEFAULT_BLOCK_ATTRIBUTES_CONTEXT )
const SetAttributesContext = createContext( DEFAULT_SET_ATTRIBUTES_CONTEXT )
const BlockContextContext = createContextSelector( DEFAULT_BLOCK_CONTEXT_CONTEXT )

const SELECTOR_DEFAULT = state => state
const EMPTY_OBJ = {}

// This returns the attributes of the block, filtered by the selector function.
// This prevents rerenders because the attributes are only updated when there's
// an actual change in the attributes specified by the selector function.
export const useBlockAttributesContext = ( selectorFn = SELECTOR_DEFAULT ) => {
	return useContextSelector( AttributesContext, state => {
		return selectorFn( state )
	} )
}

export const useBlockSetAttributesContext = () => {
	return useContext( SetAttributesContext )
}

// This returns the attributes of the block, filtered by the selector function.
// This prevents rerenders because the attributes are only updated when there's
// an actual change in the attributes specified by the selector function.
export const useBlockContextContext = ( selectorFn = SELECTOR_DEFAULT ) => {
	return useContextSelector( BlockContextContext, state => {
		return selectorFn( state )
	} )
}

// All our blocks' Edit should be wrapped in this provider.
export const BlockAttributesProvider = props => {
	return <AttributesContext.Provider value={ props.attributes }>
		<SetAttributesContext.Provider value={ props.setAttributes }>
			<BlockContextContext.Provider value={ props.context || EMPTY_OBJ }>
				{ props.children }
			</BlockContextContext.Provider>
		</SetAttributesContext.Provider>
	</AttributesContext.Provider>
}
