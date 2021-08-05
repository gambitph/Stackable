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
import {
	Fragment, useMemo,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useAttributeEditHandlers, useBlockEl } from '~stackable/hooks'

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

	const blockEl = useBlockEl()

	const borderRadiusPlaceholder = useMemo( () => {
		return blockEl
			? () => blockEl.el() && parseFloat( window.getComputedStyle( props.borderSelector ? blockEl.el().querySelector( props.borderSelector ) : blockEl.el() ).borderRadius )
			: null
	}, [ blockEl, props.borderSelector ] )

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
					label={ __( 'Border Width' ) }
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
				className="ugb--help-tip-general-border-radius"
				min={ 0 }
				sliderMax={ 50 }
				placeholderRender={ borderRadiusPlaceholder }
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
}
