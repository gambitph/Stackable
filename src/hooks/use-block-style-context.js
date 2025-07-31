/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element'

const BlockStyleContext = createContext( null )

export const useBlockStyleContext = () => {
	return useContext( BlockStyleContext )
}

// All our blocks' Edit should be wrapped in this provider.
export const BlockStyleProvider = props => {
	return <BlockStyleContext.Provider value={ [
		props.blockStyles,
		{
			clientId: props.clientId,
			context: props.context,
		},
	] }>
		{ props.children }
	</BlockStyleContext.Provider>
}
