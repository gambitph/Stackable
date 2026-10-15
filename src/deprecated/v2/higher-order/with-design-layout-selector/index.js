/**
 * Higher-order component for displaying layout design selector when adding a new Stackable block.
 */

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { useMemo } from '@wordpress/element'

/**
 * Internal dependencies
 */
import DesignLayoutSelector from './design-layout-selector'
import { getPropsWithDefaults } from '../../../../util/props'

// When block is listed, it should not open the selector initially.
const blocksShouldNotOpenSelectorInitially = [
	'ugb/column',
	'ugb/columns',
]

const withDesignLayoutSelector = createHigherOrderComponent(
	WrappedComponent => {
		const NewComponent = incomingProps => {
			const props = getPropsWithDefaults( incomingProps, NEW_COMPONENT_DEFAULT_PROPS )
			const hasEmptyDesign = typeof props.attributes.design !== 'undefined' && props.attributes.design === ''
			const hasLayoutPicker = useMemo( () => {
				return ! blocksShouldNotOpenSelectorInitially.includes( props.name )
			}, [] )

			if ( hasLayoutPicker && hasEmptyDesign ) {
				return <DesignLayoutSelector { ...props } />
			}

			return <WrappedComponent { ...props } />
		}

		const NEW_COMPONENT_DEFAULT_PROPS = {
			...( WrappedComponent.stackableDefaultProps || WrappedComponent.defaultProps || {} ),
			attributes: {},
		}
		NewComponent.stackableDefaultProps = NEW_COMPONENT_DEFAULT_PROPS

		return NewComponent
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector

