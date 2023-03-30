/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	createContext, useContext, useState,
} from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'
import classnames from 'classnames/dedupe'

/**
 * Context used by the Columns block to apply a class that
 */
export const SetActiveTabContext = createContext( null )

export const useSetActiveTabContext = () => {
	return useContext( SetActiveTabContext )
}

const withActiveTab = createHigherOrderComponent(
	WrappedComponent => props => {
		const [ activeTab, setActiveTab ] = useState( null )

		if ( props.name !== 'stackable/tab-labels' ) {
			return <WrappedComponent { ...props } />
		}

		const classNames = classnames( props.className, `stk--active-tab-${ activeTab }` )

		return (
			<SetActiveTabContext.Provider value={ setActiveTab }>
				<WrappedComponent { ...props } className={ classNames } />
			</SetActiveTabContext.Provider>
		)
	},
	'withActiveTab'
)

export default withActiveTab

addFilter(
	'editor.BlockListBlock',
	'stackable/tab-labels-with-active-tab',
	withActiveTab
)
