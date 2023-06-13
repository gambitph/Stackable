/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	 AdvancedToolbarControl,
	 ColorPaletteControl,
	 ShadowControl,
	 AdvancedRangeControl,
	 FourRangeControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useAttributeEditHandlers } from '~stackable/hooks'

const BORDER_CONTROLS = [
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

export const BorderControls = props => {
	const {
		getAttribute,
		getAttrName,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	return (
		<Fragment>
			{ props.hasBorderType &&
				<AdvancedToolbarControl
					label={ __( 'Borders', i18n ) }
					controls={ BORDER_CONTROLS }
					className="ugb-border-controls__border-type-toolbar"
					attribute={ getAttrName( 'borderType' ) }
					fullwidth={ true }
					isSmall={ true }
				/>
			}

			{ ( getAttribute( 'borderType' ) || ! props.hasBorderType ) && props.hasBorderControls &&
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
				/>
			}

			{ ( getAttribute( 'borderType' ) || ! props.hasBorderType ) && props.hasBorderControls &&
				<ColorPaletteControl
					label={ __( 'Border Color', i18n ) }
					attribute={ getAttrName( 'borderColor' ) }
					hover="all"
					hasTransparent={ true }
				/>
			}

			<AdvancedRangeControl
				label={ __( 'Border Radius', i18n ) }
				attribute={ getAttrName( 'borderRadius' ) }
				responsive="all"
				hover={ props.hasBorderRadiusHover }
				helpTooltip={ {
					description: __( 'Border Radius', i18n ),
				} }
				min={ 0 }
				sliderMax={ props.borderSliderMax }
				placeholderRender={ props.borderRadiusPlaceholder }
			/>
			<ShadowControl
				label={ __( 'Shadow / Outline', i18n ) }
				attribute={ getAttrName( 'shadow' ) }
				hover="all"
			/>
		</Fragment>
	)
}

BorderControls.defaultProps = {
	attrNameTemplate: '%s',
	blockEl: null,
	hasBorderType: true,
	hasBorderControls: true,
	hasBorderRadiusHover: true,
	borderSelector: null,
	borderSliderMax: 50,
}
