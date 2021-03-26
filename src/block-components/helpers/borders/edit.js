/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { camelCase, upperFirst } from 'lodash'
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
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { useCallback, Fragment } from '@wordpress/element'
import {
	 __, _x, sprintf,
} from '@wordpress/i18n'
import { BaseControl, ToggleControl } from '@wordpress/components'
import { useBlockAttributes, useDeviceType } from '~stackable/hooks'
import { getAttrNameFunction, urlIsVideo } from '~stackable/util'

// TODO: add advanced shadows
export const BorderControls = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const deviceType = useDeviceType()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const getAttrName = getAttrNameFunction( props.attrNameTemplate )
	const getAttribute = attrName => attributes[ getAttrName( attrName ) ]
	const updateAttributes = attrName => value => updateBlockAttributes( clientId, { [ getAttrName( attrName ) ]: value } )

	return (
		<Fragment>
			<AdvancedRangeControl
				label={ __( 'Border Radius', i18n ) }
				value={ getAttribute( 'borderRadius' ) }
				onChange={ updateAttributes( 'borderRadius' ) }
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

