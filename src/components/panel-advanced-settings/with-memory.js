/**
 * In charge of keeping the previous state of the panels, whether the panels are
 * open or closed. This assumes that there can only be one panel open at a time.
 */

/**
 * WordPress dependencies
 */
import { Fragment, useMemo } from '@wordpress/element'
import { select } from '@wordpress/data'
import { addAction } from '@wordpress/hooks'

const panelCache = {}
const tabCache = {}

// If the tab was changed, remember it.
addAction( 'stackable.inspector.tab.click', 'stackable/panel-memory', ( clientId, tab ) => {
	tabCache[ clientId ] = tab
} )

// Keep the tab position at the start.
addAction( 'stackable.inspector.tab.initial', 'stackable/panel-memory', ( clientId, tab ) => {
	if ( typeof tabCache[ clientId ] === 'undefined' ) {
		tabCache[ clientId ] = tab
	}
} )

const getTab = panelEl => {
	const tabEl = panelEl.closest( '[data-ugb-tab]' )
	if ( tabEl ) {
		return tabEl.getAttribute( 'data-ugb-tab' )
	}
	return ''
}

const withMemory = WrappedComponent => {
	const NewComp = props => {
		const clientId = useMemo( () => select( 'core/block-editor' ).getSelectedBlockClientId(), [] )

		// When a panel is opened, remember that.
		const onToggle = ( isOpen, panelRef ) => {
			if ( clientId && props.withCaching ) {
				const tab = getTab( panelRef.current )
				const uid = `${ clientId }-${ tab }`
				tabCache[ clientId ] = tab
				panelCache[ uid ] = isOpen ? props.title : null
			}

			props.onToggle( isOpen )
		}

		const propsToPass = {
			...props,
			onToggle,
		}

		if ( clientId && props.withCaching ) {
			const currentTab = tabCache[ clientId ] || ''
			const uid = `${ clientId }-${ currentTab }`

			// Open the last panel that was opened.
			const lastOpenPanel = panelCache[ uid ]
			if ( lastOpenPanel ) {
				// Only 1 panel is open
				propsToPass.initialOpen = lastOpenPanel === props.title
			} else if ( lastOpenPanel === null ) {
				// All are closed
				propsToPass.initialOpen = false
			}
		}

		return (
			<Fragment>
				<WrappedComponent { ...propsToPass } />
			</Fragment>
		)
	}

	NewComp.defaultProps = {
		...( WrappedComponent.defaultProps || {} ),
		withCaching: true,
	}

	return NewComp
}

export default withMemory
