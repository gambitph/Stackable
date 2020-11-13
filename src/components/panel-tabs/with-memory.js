/**
 * This is in charge of preserving the last selected tab for a block. So when
 * selecting different blocks, the last selected tab is preserved.
 */

/**
 * External dependencies
 */
import { isUnmodifiedBlock } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'

const tabCache = {}

const withMemory = WrappedComponent => {
	const NewComp = props => {
		const onClick = tab => {
			// Cache it.
			tabCache[ props.blockProps.clientId ] = tab

			doAction( 'stackable.inspector.tab.click', props.blockProps.clientId, tab )

			props.onClick( tab )
		}

		const initialTab = props.initialTab || // If there's a prop, use it.
			tabCache[ props.blockProps.clientId ] || // Or check if there's a previously selected tab.
			( isUnmodifiedBlock( props.blockProps ) ? 'layout' : 'style' ) // Or if not, default to layout or the style tab.

		doAction( 'stackable.inspector.tab.initial', props.blockProps.clientId, initialTab )

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

	NewComp.defaultProps = {
		...( WrappedComponent.defaultProps || {} ),
	}

	return NewComp
}

export default withMemory
