/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	 AdvancedToolbarControl,
	 AdvancedRangeControl,
	 AdvancedSelectControl,
	 BlendModeControl,
	 ButtonIconPopoverControl,
	 ColorPaletteControl,
	 ControlSeparator,
	 ImageControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import {
	 __, _x, sprintf,
} from '@wordpress/i18n'
import { ToggleControl } from '@wordpress/components'
import {
	useAttributeEditHandlers, useDeviceType,
} from '~stackable/hooks'

// TODO: add advanced shadows
export const BorderControls = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		updateAttributeHandler,
		// updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	return (
		<Fragment>
			<AdvancedRangeControl
				label={ __( 'Border Radius', i18n ) }
				value={ getAttribute( 'borderRadius' ) }
				onChange={ updateAttributeHandler( 'borderRadius' ) }
				min={ 0 }
				sliderMax={ 50 }
				allowReset={ true }
				placeholder="12"
				className="ugb--help-tip-general-border-radius"
			/>

		</Fragment>
	)
}

BorderControls.defaultProps = {
	attrNameTemplate: '%s',
}

