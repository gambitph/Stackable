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
import { DEFAULT_PERCENT, DEFAULT_THICKNESS } from '~stackable/block-components/progress-bar/attributes'

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
		progressAnimate,
		progressDisplayPercent,
		progressRounded,
	} = useBlockAttributesContext()

	const {
		getAttribute,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )

	const progressAriaValueText = getAttribute( 'progressAriaValueText' )
	const [ valueText, setValueText ] = useState( progressAriaValueText )

	const contentChangeHandler = useCallback( debounce( newValueText => {
		updateAttribute( 'progressAriaValueText', newValueText )
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
						attribute="progressPercent"
						min="0"
						sliderMax="100"
						step="1"
						placeholder=""
						isDynamic
					/>
					<AdvancedToggleControl
						label={ __( 'Animate', i18n ) }
						checked={ progressAnimate }
						onChange={ progressAnimate => setAttributes( { progressAnimate } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Display percentage', i18n ) }
						checked={ progressDisplayPercent }
						onChange={ progressDisplayPercent => setAttributes( { progressDisplayPercent } ) }
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
						attribute="progressThickness"
						min="8"
						sliderMax="100"
						step="1"
						placeholder=""
						default={ DEFAULT_THICKNESS }
					/>
					<AdvancedToggleControl
						label={ __( 'Rounded', i18n ) }
						checked={ progressRounded }
						onChange={ progressRounded => setAttributes( { progressRounded } ) }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	attrNameTemplate: '%s',
}
