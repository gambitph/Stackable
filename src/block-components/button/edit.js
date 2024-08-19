/*
 * External dependencies
 */
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	FourRangeControl,
	AdvancedToggleControl,
	AdvancedSelectControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers,
	useBlockAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { BorderControls as _BorderControls } from '../helpers/borders'
import { Link as _Link } from '../link'
import { Icon as _Icon } from '../icon'
import { applyFilters } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const Icon = props => (
	<_Icon.InspectorControls
		hasColor={ props.hasColor }
		hasGradient={ false }
		hasShape={ false }
		hasBackgroundShape={ false }
		hasIconGap={ props.hasIconGap }
		hasIconPosition={ props.hasIconPosition }
		defaultValue={ props.defaultValue }
	/>
)

Icon.defaultProps = {
	hasIconGap: true,
	hasIconPosition: true,
	hasColor: true,
	defaultValue: '',
}

export const Link = _Link.InspectorControls

const HOVER_OPTIONS = [
	{
		label: __( 'None', i18n ),
		value: '',
	},
	{
		label: __( 'Darken', i18n ),
		value: 'darken',
	},
	{
		label: __( 'Lift', i18n ),
		value: 'lift',
	},
	{
		label: __( 'Scale', i18n ),
		value: 'scale',
	},
	{
		label: __( 'Lift & Scale', i18n ),
		value: 'lift-scale',
	},
	{
		label: __( 'Lift More', i18n ),
		value: 'lift-more',
	},
	{
		label: __( 'Scale More', i18n ),
		value: 'scale-more',
	},
	{
		label: __( 'Lift & Scale More', i18n ),
		value: 'lift-scale-more',
	},
]

export const HoverEffects = () => {
	return (
		<AdvancedSelectControl
			label={ __( 'Hover Effect', i18n ) }
			attribute="buttonHoverEffect"
			options={ HOVER_OPTIONS }
			default="darken"
			helpTooltip={ {
				video: 'button-hover-effect',
				title: __( 'Hover effect', i18n ),
				description: __( 'Triggers animation or effects when you mouse over', i18n ),
			} }
		/>
	)
}

export const ColorsControls = props => {
	const {
		hasIconColor,
		hasTextColor,
		attrNameTemplate = 'button%s',
	} = props

	const {
		getAttrName,
	} = useAttributeEditHandlers( attrNameTemplate )

	const buttonBackgroundColorType = useBlockAttributesContext( attributes => {
		return attributes[ getAttrName( 'backgroundColorType' ) ]
	} )

	return ( <>
		<AdvancedToolbarControl
			controls={ [
				{
					value: '',
					title: __( 'Single', i18n ),
				},
				{
					value: 'gradient',
					title: __( 'Gradient', i18n ),
				},
			] }
			attribute={ getAttrName( 'backgroundColorType' ) }
			isSmall={ true }
		/>
		<ColorPaletteControl
			label={ __( 'Button Color', i18n ) }
			attribute={ getAttrName( 'backgroundColor' ) }
			hover="all"
			isGradient={ buttonBackgroundColorType === 'gradient' }
		/>

		{ hasTextColor && (
			<ColorPaletteControl
				label={ __( 'Text Color', i18n ) }
				attribute="textColor1"
				hover="all"
			/>
		) }

		{ hasIconColor && (
			<ColorPaletteControl
				label={ __( 'Icon Color', i18n ) }
				attribute="iconColor1"
				hover="all"
			/>
		) }
	</> )
}

export const Colors = props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Colors', i18n ) }
				id="button-colors"
			>
				<ColorsControls { ...props } />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Colors.defaultProps = {
	hasTextColor: true,
	hasIconColor: false,
}

const SizeControls = props => {
	const {
		attrNameTemplate = 'button%s',
	} = props

	const {
		getAttrName,
	} = useAttributeEditHandlers( attrNameTemplate )

	return ( <>
		{ props.hasFullWidth && (
			<AdvancedToggleControl
				label={ __( 'Full Width', i18n ) }
				attribute={ getAttrName( 'fullWidth' ) }
			/>
		) }
		<AdvancedRangeControl
			label={ __( 'Min. Button Height', i18n ) }
			responsive="all"
			attribute={ getAttrName( 'minHeight' ) }
			min={ 0 }
			max={ 100 }
		/>
		{ props.hasWidth && ! props.hasFullWidth && (
			<AdvancedRangeControl
				label={ __( 'Button Width', i18n ) }
				responsive="all"
				attribute={ getAttrName( 'width' ) }
				min={ 0 }
				max={ 100 }
				placeholder=""
			/>
		) }
		<FourRangeControl
			label={ __( 'Button Padding', i18n ) }
			units={ [ 'px', '%' ] }
			responsive="all"
			defaultLocked={ true }
			attribute={ getAttrName( 'padding' ) }
			sliderMin={ [ 0, 0 ] }
			sliderMax={ [ 40, 100 ] }
			vhMode={ true }
			helpTooltip={ {
				// TODO: Add a working video
				title: __( 'Button padding', i18n ),
				description: __( 'Adjusts the space between the button text and button borders', i18n ),
			} }
		/>
	</> )
}

export const Size = props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Size & Spacing', i18n ) }
				id="button"
			>
				<SizeControls { ...props } />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Size.defaultProps = {
	hasWidth: false,
}

const BorderControls = props => {
	return (
		<_BorderControls
			hasBorderRadiusHover={ false }
			borderSelector={ props.borderSelector }
			borderRadiusPlaceholder={ props.placeholder }
			{ ...props }
		/>
	)
}

export const Borders = props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Borders & Shadows', i18n ) }
				id="button-borders"
			>
				<BorderControls
					attrNameTemplate="button%s"
					hasBorderRadiusHover={ false }
					{ ...props }
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Borders.defaultProps = {
	borderSelector: '',
}

export const Edit = props => {
	const {
		borderSelector,
		hasTextColor,
		hasIcon,
		hasLink,
		hasIconGap,
		hasIconPosition,
		borderRadiusPlaceholder,
		hasFullWidth,
		...propsToPass
	} = props

	const { clientId } = useBlockEditContext()
	const { parentBlock } = useSelect(
		select => {
			const { getBlockRootClientId, getBlock } = select( 'core/block-editor' )
			const rootClientId = getBlockRootClientId( clientId )

			return {
				parentBlock: getBlock( rootClientId ),
			}
		},
		[ clientId ]
	)

	const enableLink = applyFilters( 'stackable.edit.button.enable-link', true, parentBlock )

	return (
		<>
			{ ( hasLink && enableLink ) && <Link hasAnchorId={ true } /> }
			<Colors hasTextColor={ hasTextColor } { ...propsToPass } />
			<Size hasFullWidth={ hasFullWidth } />
			<Borders
				borderSelector={ borderSelector }
				placeholder={ borderRadiusPlaceholder }
			/>
			{ hasIcon && (
				<Icon
					hasIconGap={ hasIconGap }
					hasIconPosition={ hasIconPosition }
				/>
			) }
		</>
	)
}

Edit.defaultProps = {
	hasIcon: true,
	hasLink: true,
	borderSelector: '',
	hasTextColor: true,
	hasIconGap: true,
	hasIconPosition: true,
	hasFullWidth: false,
}

Edit.Link = Link
Edit.Colors = Colors
Edit.Colors.Controls = ColorsControls
Edit.Size = Size
Edit.Size.Controls = SizeControls
Edit.Borders = Borders
Edit.Borders.Controls = BorderControls
Edit.Icon = Icon
Edit.HoverEffects = HoverEffects
