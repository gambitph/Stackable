import { useSelect } from '@wordpress/data'
import rawBlockDesignSystem from '~stackable/styles/block-design-system.json'
/**
 * Provides a function to get the placeholder for block componets from block layout settings.
 *
 * @return {Object} Functions
 */
export const useBlockLayoutDefaults = () => {
	const { blockLayouts } = useSelect( select => {
		const spacingAndBorders = select( 'stackable/global-spacing-and-borders' ).getBlockLayouts()
		const buttonsAndIcons = select( 'stackable/global-buttons-and-icons' ).getBlockLayouts()
		return { blockLayouts: { ...spacingAndBorders, ...buttonsAndIcons } }
	}, [] )

	const _blockDesignSystem = { ...rawBlockDesignSystem }
	const defaults = Object.values( _blockDesignSystem ).reduce( ( blockDesignSystem, section ) => {
		Object.entries( section ).forEach( ( [ key, value ] ) => {
			if ( typeof value === 'object' && 'hoverStates' in value ) {
				delete value.hoverStates
			}
			blockDesignSystem[ key ] = value
		} )
		return blockDesignSystem
	}, {} )

	const getInheritedValue = ( obj, property, device ) => {
		let value = obj[ property ]?.[ device ]

		if ( ! value && device === 'mobile' ) {
			value = obj[ property ]?.tablet
		}

		if ( ! value && ( device === 'mobile' || device === 'tablet' ) ) {
			value = obj[ property ]?.desktop
		}

		return value
	}

	const getPlaceholder = ( property, {
		device = 'desktop', single = true,
	} = {} ) => {
		const deviceState = `${ device }`
		const defaultValue = getInheritedValue( defaults, property, deviceState )

		// Get placeholder from block layout settings or use default value
		let placeholder = getInheritedValue( blockLayouts, property, deviceState ) || defaultValue

		// Return single value for four range controls
		if ( typeof placeholder === 'object' && single ) {
			placeholder = placeholder.top || placeholder.right || placeholder.bottom || placeholder.left
		} else if ( typeof placeholder === 'object' ) {
			placeholder = {
				top: placeholder.top || defaultValue.top,
				right: placeholder.right || defaultValue.right,
				bottom: placeholder.bottom || defaultValue.bottom,
				left: placeholder.left || defaultValue.left,
			}
		}

		return placeholder
	}

	return {
		blockLayouts,
		defaults,
		getPlaceholder,
	}
}
