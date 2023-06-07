/**
 * External dependencies
 */
import {
	i18n, showProNotice, isPro,
} from 'stackable'

/**
 * Internal dependencies
 */
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	IconControl,
	AdvancedSelectControl,
	AdvancedRangeControl,
	FourRangeControl,
	ProControlButton,
	ProControl,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment, useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

export const Edit = props => {
	const {
		hasShape,
		hasIconGap,
		hasIconPosition,
		hideControlsIfIconIsNotSet = false,
		iconSizeProps = {},
		iconControlHelp,
		initialOpen,
		hasMultiColor,
		hasGradient,
		wrapInPanels = true,
		responsive = 'all',
		hover = 'all',
		defaultValue,
	} = props

	const PremiumColorControls = useMemo( () => applyFilters( 'stackable.block-component.icon.color-controls', null ), [] )
	const PremiumShapeColorControls = useMemo( () => applyFilters( 'stackable.block-component.icon.shape-color-controls', null ), [] )
	const PremiumBackgroundShapeControls = useMemo( () => applyFilters( 'stackable.block-component.icon.edit.background-shape', null ), [] )

	const attributes = useBlockAttributesContext( attributes => {
		return {
			icon: attributes.icon,
			iconColorType: attributes.iconColorType,
			shapeColorType: attributes.shapeColorType,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()

	const showIconControl = hideControlsIfIconIsNotSet ? !! attributes.icon : true

	const filteredColorTypes = applyFilters( 'stackable.block-component.icon.color-types', [
		{
			value: '',
			title: __( 'Single', i18n ),
		},
	], props )

	const filteredShapeColorTypes = applyFilters( 'stackable.block-component.icon.shape-color-types', [
		{
			value: '',
			title: __( 'Single', i18n ),
		},
	], props )

	const iconControls = (
		<>
			<IconControl
				label={ applyFilters( 'stackable.block-component.icon.label', __( 'Icon', i18n ) ) }
				value={ attributes.icon }
				defaultValue={ defaultValue }
				onChange={ icon => setAttributes( { icon } ) }
				help={ iconControlHelp }
				hasPanelModifiedIndicator={ false }
			/>

			{ showProNotice && ( hasMultiColor || hasGradient ) && <ProControlButton type="icon-colors" /> }

			{ applyFilters( 'stackable.block-component.icon.after', null ) }

			{ filteredColorTypes.length > 1 && (
				<AdvancedToolbarControl
					controls={ filteredColorTypes }
					isSmall={ true }
					fullwidth={ false }
					attribute="iconColorType"
				/>
			) }

			{ /* { showIconControl && colorControls } */ }
			{ showIconControl && (
				<>
					{ ( attributes.iconColorType || '' ) === '' && (
						<ColorPaletteControl
							label={ __( 'Icon Color', i18n ) }
							attribute="iconColor1"
							hover={ hover }
						/>
					) }
					{ PremiumColorControls && <PremiumColorControls { ...props } /> }
				</>
			) }

			{ showIconControl && <AdvancedRangeControl
				label={ __( 'Icon Size', i18n ) }
				attribute="iconSize"
				min={ 0 }
				sliderMax={ 100 }
				step={ 1 }
				allowReset={ true }
				placeholder=""
				responsive={ responsive }
				{ ...iconSizeProps }
			/> }

			{ showIconControl && <AdvancedRangeControl
				label={ __( 'Icon Opacity', i18n ) }
				attribute="iconOpacity"
				min={ 0 }
				max={ 1 }
				step={ 0.1 }
				allowReset={ true }
				placeholder="1.0"
				hover={ hover }
			/> }

			{ showIconControl && <AdvancedRangeControl
				label={ __( 'Icon Rotation', i18n ) }
				attribute="iconRotation"
				min={ 0 }
				max={ 360 }
				allowReset={ true }
				placeholder="0"
				hover={ hover }
			/> }

			{ hasIconPosition && (
				<AdvancedSelectControl
					label={ __( 'Icon Position', i18n ) }
					attribute="iconPosition"
					options={ [
						{ value: '', label: __( 'Left', i18n ) },
						{ value: 'right', label: __( 'Right', i18n ) },
					] }
				/>
			) }

			{ hasIconGap && (
				<AdvancedRangeControl
					label={ __( 'Icon Gap', i18n ) }
					attribute="iconGap"
					min={ 0 }
					sliderMax={ 50 }
					allowReset={ true }
					placeholder="0"
				/>
			) }
		</>
	)

	const iconShapeControls = (
		<>
			{ filteredShapeColorTypes.length > 1 && (
				<AdvancedToolbarControl
					controls={ filteredShapeColorTypes }
					isSmall={ true }
					fullwidth={ false }
					attribute="shapeColorType"
				/>
			) }

			{ ( attributes.shapeColorType || '' ) === '' && (
				<ColorPaletteControl
					label={ __( 'Shape Color', i18n ) }
					attribute="shapeColor1"
					hover="all"
					hasTransparent={ true }
				/>
			) }
			{ PremiumShapeColorControls && <PremiumShapeColorControls { ...props } /> }

			<AdvancedRangeControl
				label={ __( 'Shape Border Radius', i18n ) }
				attribute="shapeBorderRadius"
				hover={ hover }
				min={ 0 }
				sliderMax={ 100 }
				step={ 1 }
				allowReset={ true }
				placeholder={ 50 }
			/>

			<AdvancedRangeControl
				label={ __( 'Shape Padding', i18n ) }
				attribute="shapePadding"
				min={ 0 }
				sliderMax={ 150 }
				step={ 1 }
				allowReset={ true }
				placeholder={ 20 }
			/>

			<FourRangeControl
				label={ __( 'Shape Outline Width', i18n ) }
				units={ [ 'px' ] }
				min={ 0 }
				step={ 1 }
				sliderMax={ 20 }
				defaultLocked={ true }
				attribute="shapeOutlineWidth"
				responsive={ responsive }
				default="1"
			/>

			<ColorPaletteControl
				label={ __( 'Shape Outline Color', i18n ) }
				attribute="shapeOutlineColor"
				hasTransparent={ true }
				hover={ hover }
			/>
		</>
	)

	const iconBackgroundShapeControls = <ProControl type="icon-background-shape" />

	const Wrapper = wrapInPanels ? InspectorStyleControls : Fragment

	return (
		<Wrapper>
			{ wrapInPanels
				? <PanelAdvancedSettings title={ __( 'Icon', i18n ) } id="icon" initialOpen={ initialOpen }>{ iconControls }</PanelAdvancedSettings>
				: iconControls
			}
			{ hasShape && ( wrapInPanels
				? <PanelAdvancedSettings title={ __( 'Icon Shape', i18n ) } id="icon-shape" >{ iconShapeControls }</PanelAdvancedSettings>
				: iconShapeControls
			) }

			{ props.hasBackgroundShape &&
				<>
					{ showProNotice && ! isPro && (
						wrapInPanels
							? <PanelAdvancedSettings title={ __( 'Background Shape', i18n ) } id="icon-background-shape" isPremiumPanel> { iconBackgroundShapeControls }</PanelAdvancedSettings>
							: iconBackgroundShapeControls
					) }

					{ PremiumBackgroundShapeControls && <PremiumBackgroundShapeControls { ...props } /> }
				</>
			}
		</Wrapper>
	)
}

Edit.defaultProps = {
	label: __( 'Icon', i18n ),
	hasColor: true,
	hasGradient: true,
	hasShape: true,
	hasShapeGradient: true,
	hasBackgroundShape: true,
	initialOpen: false,
	hasIconGap: false,
	hasIconPosition: false,
	hasMultiColor: false,
	defaultValue: '',
}
