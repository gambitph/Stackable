/**
 * This is in charge of preserving the last selected tab for a block. So when
 * selecting different blocks, the last selected tab is preserved.
 */

/**
 * External dependencies
 */
import { first } from 'lodash'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'
import { getPropsWithDefaults } from '../../../../util/props'

const tabCache = {}

const withMemory = WrappedComponent => {
	const NewComp = incomingProps => {
		const props = getPropsWithDefaults( incomingProps, NEW_COMP_DEFAULT_PROPS )
		const { clientId } = useBlockEditContext()

		const onClick = tab => {
			// Cache it.
			tabCache[ clientId ] = tab

			doAction( 'stackable.inspector.tab.click', clientId, tab )

			props.onClick( tab )
		}

		const initialTab = props.initialTab || // If there's a prop, use it.
			tabCache[ clientId ] || // Or check if there's a previously selected tab.
			( props.tabs?.includes( 'style' ) ? 'style' : ( first( props.tabs ) || 'style' ) ) // Default to the style tab.

		doAction( 'stackable.inspector.tab.initial', clientId, initialTab )

		const propsToPass = {
			...props,
			initialTab,
			onClick,
		}

		return (
			<Fragment>
				<WrappedComponent { ...propsToPass } />
			</Fragment>
		)
	}

	const NEW_COMP_DEFAULT_PROPS = {
		...( WrappedComponent.stackableDefaultProps || WrappedComponent.defaultProps || {} ),
	}
	NewComp.stackableDefaultProps = NEW_COMP_DEFAULT_PROPS

	return NewComp
}

export default withMemory
