/**
 * External dependencies
 */
import { unescape, debounce } from 'lodash'
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorStyleControls,
	AdvancedToggleControl,
	AdvancedRangeControl,
	AdvancedTextControl,
	ColorPaletteControl,
} from '~stackable/components'
import {
	useBlockAttributesContext, useBlockSetAttributesContext, useAttributeEditHandlers,
} from '~stackable/hooks'
import { DEFAULT_PERCENT, DEFAULT_THICKNESS } from '~stackable/block/progress-circle/schema'

/**
 * WordPress dependencies
 */
import {
	Fragment, useState, useEffect, useCallback,
} from '@wordpress/element'
import { escapeHTML } from '@wordpress/escape-html'
import { __ } from '@wordpress/i18n'

export const Edit = ( { attrNameTemplate } ) => {
	const setAttributes = useBlockSetAttributesContext()
	const {
		animate,
		displayPercentage,
		isRounded,
	} = useBlockAttributesContext()

	const {
		getAttribute,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )

	const ariaValueText = getAttribute( 'ariaValueText' )
	const [ valueText, setValueText ] = useState( ariaValueText )

	const contentChangeHandler = useCallback( debounce( newValueText => {
		updateAttribute( 'ariaValueText', newValueText )
	}, 750 ), [] )

	useEffect( () => {
		contentChangeHandler( valueText )
	}, [ valueText ] )

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Progress Bar', i18n ) }
					initialOpen
				>
					<AdvancedRangeControl
						label={ __( 'Percentage', i18n ) }
						default={ DEFAULT_PERCENT }
						attribute="percentage"
						min="0"
						sliderMax="100"
						step="1"
						placeholder=""
						isDynamic
					/>
					<AdvancedToggleControl
						label={ __( 'Animate', i18n ) }
						checked={ animate }
						onChange={ animate => setAttributes( { animate } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Display percentage', i18n ) }
						checked={ displayPercentage }
						onChange={ displayPercentage => setAttributes( { displayPercentage } ) }
					/>
					<AdvancedTextControl
						label={ __( 'Accessibility Label', i18n ) }
						value={ unescape( valueText ) }
						onChange={ newValueText => setValueText( escapeHTML( newValueText ) ) }
						/**
						 * Pass the unescaped Dynamic Content `onChange` function.
						 *
						 * @param {string} text Text with dynamic content.
						 */
						changeDynamicContent={ setValueText }
						isDynamic={ true }
					/>
					<ColorPaletteControl
						label={ __( 'Color', i18n ) }
						attribute="progressColor"
						hasTransparent={ true }
					/>
					<ColorPaletteControl
						label={ __( 'Background Color', i18n ) }
						attribute="progressBackgroundColor"
						hasTransparent={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Thickness', i18n ) }
						attribute="thickness"
						min="8"
						sliderMax="100"
						step="1"
						placeholder=""
						default={ DEFAULT_THICKNESS }
					/>
					<AdvancedToggleControl
						label={ __( 'Rounded', i18n ) }
						checked={ isRounded }
						onChange={ isRounded => setAttributes( { isRounded } ) }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	attrNameTemplate: '%s',
}
