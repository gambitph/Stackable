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
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers, useBlockContext, useBlockHoverState,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { getColorClassName } from '@wordpress/block-editor'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers/borders'
import { Link as _Link } from '../link'
import { Icon as _Icon } from '../icon'
import { applyFilters } from '@wordpress/hooks'

export const Icon = props => (
	<_Icon.InspectorControls
		hasColor={ props.hasColor }
		hasGradient={ false }
		hasShape={ false }
		hasBackgroundShape={ false }
		hasIconGap={ props.hasIconGap }
		hasIconPosition={ props.hasIconPosition }
	/>
)

Icon.defaultProps = {
	hasIconGap: true,
	hasIconPosition: true,
	hasColor: true,
}

export const Link = _Link.InspectorControls

export const Colors = props => {
	const [ state ] = useBlockHoverState()

	const {
		getAttribute,
		updateAttribute,
	} = useAttributeEditHandlers()

	const colors = useSelect( select => select( 'core/block-editor' ).getSettings().colors ) || []

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Colors' ) }
				id="button-colors"
			>
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
					attribute="buttonBackgroundColorType"
					isSmall={ true }
					fullwidth={ false }
				/>
				<ColorPaletteControl
					label={ getAttribute( 'buttonBackgroundColorType' ) === 'gradient'
						? sprintf( __( 'Button Color #%s', i18n ), 1 )
						: __( 'Button Color', i18n )
					}
					attribute="buttonBackgroundColor"
					hasTransparent={ state === 'normal' && getAttribute( 'buttonBackgroundColorType' ) !== 'gradient' }
					hover="all"
				/>
				{ getAttribute( 'buttonBackgroundColorType' ) === 'gradient' && (
					<>
						<ColorPaletteControl
							label={ __( 'Button Color #2', i18n ) }
							attribute="buttonBackgroundColor2"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Gradient Direction (degrees)', i18n ) }
							attribute="buttonBackgroundGradientDirection"
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
							hover="all"
						/>
					</>
				) }

				{ props.hasTextColor && (
					<ColorPaletteControl
						changeCallback={ _value => {
							if ( state !== 'normal' ) {
								return _value
							}
							const value = _value?.startsWith( 'var(--stk-global-color' ) ? _value.match( /(#[^\)]*)/g )[ 0 ] : _value
							const colorSlug = colors.find( ( { color } ) => value === color )?.slug
							updateAttribute( 'textColorClass', colorSlug ? getColorClassName( 'color', colorSlug ) : '' )

							return _value
						} }
						label={ __( 'Text Color', i18n ) }
						attribute="textColor1"
						hover="all"
					/>
				) }

				{ props.hasIconColor && (
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						attribute="iconColor1"
						hover="all"
					/>
				) }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Colors.defaultProps = {
	hasTextColor: true,
	hasIconColor: false,
}

export const Size = props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Size & Spacing', i18n ) }
				id="button"
			>
				{ props.hasFullWidth && (
					<AdvancedToggleControl
						label={ __( 'Full Width', i18n ) }
						attribute="buttonFullWidth"
					/>
				) }
				<AdvancedRangeControl
					label={ __( 'Min. Button Height', i18n ) }
					responsive="all"
					attribute="buttonMinHeight"
					min={ 0 }
					max={ 100 }
				/>
				{ props.hasWidth && ! props.hasFullWidth && (
					<AdvancedRangeControl
						label={ __( 'Button Width', i18n ) }
						responsive="all"
						attribute="buttonWidth"
						min={ 0 }
						max={ 100 }
						placeholder=""
					/>
				) }
				<FourRangeControl
					label={ __( 'Vertical Padding', i18n ) }
					units={ [ 'px', '%' ] }
					responsive="all"
					defaultLocked={ true }
					attribute="buttonPadding"
					sliderMin={ [ 0, 0 ] }
					sliderMax={ [ 40, 100 ] }
					enableLeft={ false }
					enableRight={ false }
				/>
				<FourRangeControl
					label={ __( 'Horizontal Padding', i18n ) }
					units={ [ 'px', '%' ] }
					responsive="all"
					defaultLocked={ true }
					attribute="buttonPadding"
					sliderMin={ [ 0, 0 ] }
					sliderMax={ [ 40, 100 ] }
					enableTop={ false }
					enableBottom={ false }
				/>

			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Size.defaultProps = {
	hasWidth: false,
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
					borderSelector={ props.borderSelector }
					borderRadiusPlaceholder={ props.placeholder }
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
	} = props

	const { parentBlock } = useBlockContext()

	const enableLink = applyFilters( 'stackable.edit.button.enable-link', true, parentBlock )

	return (
		<>
			{ ( hasLink || enableLink ) && <Link /> }
			<Colors hasTextColor={ hasTextColor } />
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
Edit.Size = Size
Edit.Borders = Borders
Edit.Icon = Icon
