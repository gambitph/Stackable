import { createContext, useContext } from '@wordpress/element'

export const DesignLibraryContext = createContext( null )

export const useDesignLibraryContext = () => {
	return useContext( DesignLibraryContext )
}
