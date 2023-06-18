/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	createContext, useContext, useState,
} from '@wordpress/element'

/**
 * Context used by the Columns block to apply a class that
 */
export const SetActiveTabContext = createContext( null )

export const useSetActiveTabContext = () => {
	return useContext( SetActiveTabContext )
}

export const withActiveTab = ( initialTabAttribute = '' ) => createHigherOrderComponent(
	WrappedComponent => props => {
		const initialValue = initialTabAttribute ? parseInt( props.attributes[ initialTabAttribute ], 10 ) : null
		const [ activeTab, setActiveTab ] = useState( initialValue || 1 )
		const [ templateLock, setTemplateLock ] = useState( true )

		return (
			<SetActiveTabContext.Provider value={ [ activeTab, setActiveTab, templateLock, setTemplateLock ] }>
				<WrappedComponent
					{ ...props }
					templateLock={ templateLock }
					setTemplateLock={ setTemplateLock }
				/>
			</SetActiveTabContext.Provider>
		)
	},
	'withActiveTab'
)
