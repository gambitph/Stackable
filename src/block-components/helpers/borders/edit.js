/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	 AdvancedToolbarControl,
	 ColorPaletteControl,
	 ShadowControl,
	 FourRangeControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import {
	useAttributeEditHandlers, useAttributeValue, useBlockLayoutDefaults, useBlockSetAttributesContext, usePresetControls,
} from '~stackable/hooks'
import { applyFilters } from '@wordpress/hooks'

export const BORDER_CONTROLS = [
	{
		value: '',
		title: __( 'None', i18n ),
	},
	{
		value: 'solid',
		title: __( 'Solid', i18n ),
	},
	{
		value: 'dashed',
		title: __( 'Dashed', i18n ),
	},
	{
		value: 'dotted',
		title: __( 'Dotted', i18n ),
	},
]

const BORDER_CONTROLS_WITH_NONE_VALUE = [
	{
		value: 'none',
		title: __( 'None', i18n ),
	},
	{
		value: 'solid',
		title: __( 'Solid', i18n ),
	},
	{
		value: 'dashed',
		title: __( 'Dashed', i18n ),
	},
	{
		value: 'dotted',
		title: __( 'Dotted', i18n ),
	},
]

export const BorderControls = props => {
	const {
		getAttrName,
		updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const borderType = useAttributeValue( 'borderType', props.attrNameTemplate )
	const borderRadius = useAttributeValue( 'borderRadius', props.attrNameTemplate )
	const borderRadiusTablet = useAttributeValue( 'borderRadiusTablet', props.attrNameTemplate )
	const borderRadiusMobile = useAttributeValue( 'borderRadiusMobile', props.attrNameTemplate )

	const getAttribute = useCallback( attrName => {
		switch ( attrName ) {
			case 'borderRadius': return borderRadius
			case 'borderRadiusTablet': return borderRadiusTablet
			case 'borderRadiusMobile': return borderRadiusMobile
			default: return undefined
		}
	}, [ borderRadius, borderRadiusTablet, borderRadiusMobile ] )

	const setAttributes = useBlockSetAttributesContext()
	const { blockLayouts, getPlaceholder } = useBlockLayoutDefaults()

	const borderControls = getPlaceholder( `${ props.placeholderTemplate }-border-style` ) !== '' ? BORDER_CONTROLS_WITH_NONE_VALUE : BORDER_CONTROLS

	applyFilters( 'stackable.block-component.helpers.borders', null, getAttribute, updateAttributes )

	const presetMarks = usePresetControls( 'borderRadius' )
		?.getPresetMarks( { addNonePreset: true } ) || null

	return (
		<Fragment>
			{ props.hasBorderType &&
				<AdvancedToolbarControl
					label={ __( 'Borders', i18n ) }
					controls={ borderControls }
					className="ugb-border-controls__border-type-toolbar"
					attribute={ getAttrName( 'borderType' ) }
					fullwidth={ true }
					isSmall={ true }
					placeholder={ getPlaceholder( `${ props.placeholderTemplate }-border-style` ) }
				/>
			}

			{ props.hasBorderControls &&
				<FourRangeControl
					label={ __( 'Border Width', i18n ) }
					attribute={ getAttrName( 'borderWidth' ) }
					responsive="all"
					hover="all"
					min={ 0 }
					max={ 99 }
					step={ 1 }
					sliderMax={ 5 }
					defaultLocked={ true }
					placeholder={ props.borderWidthPlaceholder || getPlaceholder( `${ props.placeholderTemplate }-border-width` ) }
					changeCallback={ value => {
						const hasValue = value?.top || value?.right || value?.bottom || value?.left
						const borderStyleProperty = `${ props.placeholderTemplate }-border-style`

						// Set borderType to 'solid' if no borderType is selected and no global border settings is set
						if ( hasValue && ! borderType && ! blockLayouts?.[ borderStyleProperty ] ) {
							setAttributes( { [ getAttrName( 'borderType' ) ]: 'solid' } )
						}

						return value
					} }
				/>
			}

			{ props.hasBorderControls &&
				<ColorPaletteControl
					label={ __( 'Border Color', i18n ) }
					attribute={ getAttrName( 'borderColor' ) }
					hover="all"
				/>
			}
			{ props.hasBorderRadius &&
				<FourRangeControl
					label={ __( 'Border Radius', i18n ) }
					attribute={ getAttrName( 'borderRadius2' ) }
					responsive="all"
					hover={ props.hasBorderRadiusHover }
					helpTooltip={ {
						video: 'general-border-radius',
						description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
					} }
					min={ 0 }
					isCorner={ true }
					sliderMax={ props.borderSliderMax }
					placeholder={ props.borderRadiusPlaceholder }
					marks={ presetMarks }
				/>
			}
			<ShadowControl
				label={ __( 'Shadow / Outline', i18n ) }
				attribute={ getAttrName( 'shadow' ) }
				hover="all"
				placeholder={ getPlaceholder( `${ props.placeholderTemplate }-box-shadow` ) }
			/>
		</Fragment>
	)
}

BorderControls.defaultProps = {
	attrNameTemplate: '%s',
	borderTypeValue: '', // If not supplied, the value from the attribute will be used, otherwise: '' for none, 'solid', 'dashed', 'dotted'
	hasBorderType: true,
	hasBorderControls: true,
	hasBorderRadius: true,
	hasBorderRadiusHover: true,
	borderSelector: null,
	borderSliderMax: 50,
}
