import { useSelect } from '@wordpress/data'
import defaultButtonsAndIcons from '~stackable/plugins/global-settings/buttons-and-icons/defaults.json'
import defaultSpacingAndBorders from '~stackable/plugins/global-settings/spacing-and-borders/defaults.json'
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

	const defaults = { ...defaultSpacingAndBorders, ...defaultButtonsAndIcons }

	const HoverStates = {
		normal: '',
		hover: 'Hover',
		'parent-hover': 'ParentHover',
	}

	const getDefaults = () => {
		return defaults
	}

	const getPlaceholder = ( property, {
		device = 'desktop', state = 'normal', single = true,
	} = {} ) => {
		const deviceState = `${ device }${ HoverStates[ state ] }`
		const defaultValue = defaults[ property ]?.[ deviceState ] ?? defaults[ property
		]?.desktop

		// Get placeholder from block layout settings or use default value
		let placeholder = blockLayouts[ property ]?.[ deviceState ] || defaultValue

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
		getPlaceholder,
		getDefaults,
	}
}
