/**
 * Internal dependencies
 */
import SeparatorControl from './separator-control'
import {
	AdvancedRangeControl,
	PanelAdvancedSettings,
	ColorPaletteControl,
	AdvancedToggleControl,
	ProControlButton,
	ShadowControl,
	InspectorStyleControls,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/*
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'
import { getAttributeNameFunc } from '~stackable/util'

const SEPARATOR_SHADOWS = [
	'none',
	'0px 0 1px rgba(120, 120, 120, 0.5)',
	'0px 0 2px rgba(120, 120, 120, 0.5)',
	'2px 4px 6px #000', // This is a dark shadow similar to the shadow we used by default in v2.
	'0px 5px 10px rgba(153, 153, 153, 0.35)',
	'0px 2px 20px rgba(153, 153, 153, 0.2)',
	'25px 10px 30px rgba(18, 63, 82, 0.3)',
	'0px 10px 30px rgba(0, 0, 0, 0.05)',
	'7px 5px 30px rgba(72, 73, 121, 0.15)',
	'0px 10px 60px rgba(0, 0, 0, 0.1)',
	'70px 130px -60px rgba(72, 73, 121, 0.38) ',
]

const SeparatorControls = props => {
	const {
		attrNameTemplate,
		hasFlipVertically,
	} = props

	const getAttrName = getAttributeNameFunc( attrNameTemplate )

	const separatorShadowOptions = applyFilters( 'stackable.separator.shadows', SEPARATOR_SHADOWS )

	return (
		<>
			<SeparatorControl
				label={ __( 'Design', i18n ) }
				attribute={ getAttrName( 'separatorDesign' ) }
			/>
			<ColorPaletteControl
				label={ __( 'Color', i18n ) }
				attribute={ getAttrName( 'separatorColor' ) }
			/>
			<AdvancedRangeControl
				label={ __( 'Height', i18n ) }
				min={ 30 }
				sliderMax={ 400 }
				placeholder=""
				attribute={ getAttrName( 'separatorHeight' ) }
				responsive="all"
				helpTooltip={ {
					video: 'separator-height',
					title: __( 'Separator Height', i18n ),
					description: __( 'Adjusts the height of the separator to stretch or compress vertically', i18n ),
				} }
			/>
			<AdvancedRangeControl
				label={ __( 'Width', i18n ) }
				attribute={ getAttrName( 'separatorWidth' ) }
				min={ 1 }
				sliderMax={ 4 }
				step={ 0.1 }
				helpTooltip={ {
					video: 'separator-width',
					title: __( 'Separator Width', i18n ),
					description: __( 'Adjusts the height of the separator to stretch or compress vertically', i18n ),
				} }
			/>
			<ShadowControl
				isFilter={ true }
				label={ __( 'Shadow / Outline', i18n ) }
				attribute={ getAttrName( 'separatorShadow' ) }
				options={ separatorShadowOptions }
				placeholder="5"
				helpTooltip={ {
					video: 'separator-shadow',
					title: __( 'Shadow', i18n ),
					description: __( 'Adjusts the intensity of the separator shadow and makes the separator more prominent', i18n ),
				} }
			/>
			<AdvancedToggleControl
				label={ __( 'Invert Design', i18n ) }
				attribute={ getAttrName( 'separatorInverted' ) }
			/>
			<AdvancedToggleControl
				label={ __( 'Flip Horizontally', i18n ) }
				attribute={ getAttrName( 'separatorFlipHorizontally' ) }
			/>
			{ hasFlipVertically && (
				<AdvancedToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					attribute={ getAttrName( 'separatorFlipVertically' ) }
				/>
			) }
			<AdvancedToggleControl
				label={ __( 'Bring to Front', i18n ) }
				attribute={ getAttrName( 'separatorBringToFront' ) }
				helpTooltip={ {
					video: 'separator-bring-to-front',
					title: __( 'Bring to Front', i18n ),
					description: __( 'Brings the separator layer in front of other block elements', i18n ),
				} }
			/>
		</>
	)
}

SeparatorControls.defaultProps = {
	attrNameTemplate: '%s',
	hasFlipVertically: false,
}

export const Edit = props => {
	const PremiumTopSeparatorControls = useMemo( () => applyFilters( 'stackable.block-component.separator.top.after', null ), [] )
	const PremiumBottomSeparatorControls = useMemo( () => applyFilters( 'stackable.block-component.separator.bottom.after', null ), [] )

	const setAttributes = useBlockSetAttributesContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			topSeparatorShow: attributes.topSeparatorShow,
			bottomSeparatorShow: attributes.bottomSeparatorShow,
		}
	} )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Top Separator', i18n ) }
				id="top-separator"
				hasToggle={ true }
				checked={ attributes.topSeparatorShow }
				onChange={ topSeparatorShow => setAttributes( { topSeparatorShow } ) }
			>
				<SeparatorControls attrNameTemplate="top%s" />
				{ PremiumTopSeparatorControls && <PremiumTopSeparatorControls { ...props } /> }
				{ showProNotice && <ProControlButton type="separator" /> }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Bottom Separator', i18n ) }
				id="bottom-separator"
				hasToggle={ true }
				checked={ attributes.bottomSeparatorShow }
				onChange={ bottomSeparatorShow => setAttributes( { bottomSeparatorShow } ) }
			>
				<SeparatorControls attrNameTemplate="bottom%s" />
				{ PremiumBottomSeparatorControls && <PremiumBottomSeparatorControls { ...props } /> }
				{ showProNotice && <ProControlButton type="separator" /> }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.SeparatorControls = SeparatorControls
