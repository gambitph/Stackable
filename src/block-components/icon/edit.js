/* External dependencies
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
import {
	i18n, showProNotice, isPro,
} from 'stackable'
import { useAttributeEditHandlers } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment, useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const colorTypes = applyFilters( 'stackable.block-component.icon.color-type', [
	{
		value: '',
		title: __( 'Single', i18n ),
		controls: ( { hover } ) => {
			return (
				<ColorPaletteControl
					label={ __( 'Icon Color', i18n ) }
					attribute="iconColor1"
					hover={ hover }
				/>
			)
		},
	},
] )

const shapeColorTypes = applyFilters( 'stackable.block-component.icon.shape-color-type', [
	{
		value: '',
		title: __( 'Single', i18n ),
		controls: () => {
			return (
				<ColorPaletteControl
					label={ __( 'Shape Color', i18n ) }
					attribute="shapeColor1"
					hover="all"
					hasTransparent={ true }
				/>
			)
		},
	},
] )

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
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers()

	const propsToPass = {
		...props, getAttribute, updateAttributeHandler,
	}

	const { colorControls, shapeColorControls } = useMemo( () => {
		let colorControls = null
		let shapeColorControls = null
		const selectedOption = colorTypes.find( colorType => colorType.value === ( getAttribute( 'iconColorType' ) || '' ) )
		const selectedShapeOption = shapeColorTypes.find( colorType => colorType.value === ( getAttribute( 'shapeColorType' ) || '' ) )
		if ( selectedOption ) {
			if ( selectedOption.hasOwnProperty( 'show' ) ) {
				if ( selectedOption.show( propsToPass ) ) {
					colorControls = selectedOption.controls( propsToPass )
				}
			}

			colorControls = selectedOption.controls( propsToPass )
		}

		if ( selectedShapeOption ) {
			if ( selectedShapeOption.hasOwnProperty( 'show' ) ) {
				if ( selectedShapeOption.show( propsToPass ) ) {
					shapeColorControls = selectedShapeOption.controls( propsToPass )
				}
			}

			shapeColorControls = selectedShapeOption.controls( propsToPass )
		}

		return { colorControls, shapeColorControls }
	}, [ getAttribute, updateAttributeHandler, colorTypes, props ] )

	const filteredColorTypes = useMemo( () => colorTypes.filter( colorType => colorType.hasOwnProperty( 'show' ) ? colorType.show( propsToPass ) : true ), [ getAttribute, updateAttributeHandler, colorTypes, props ] )
	const filteredShapeColorTypes = useMemo( () => shapeColorTypes.filter( colorType => colorType.hasOwnProperty( 'show' ) ? colorType.show( propsToPass ) : true ), [ getAttribute, updateAttributeHandler, shapeColorTypes, props ] )
	const showIconControl = hideControlsIfIconIsNotSet ? !! getAttribute( 'icon' ) : true

	const iconControls = (
		<>
			<IconControl
				label={ applyFilters( 'stackable.block-component.icon.label', __( 'Icon', i18n ) ) }
				value={ getAttribute( 'icon' ) }
				onChange={ updateAttributeHandler( 'icon' ) }
				help={ iconControlHelp }
			/>

			{ showProNotice && ( hasMultiColor || hasGradient ) && <ProControlButton
				title={ __( 'Say Hello to Gorgeous Icons 👋', i18n ) }
				description={ __( 'Liven up your icons with gradient fills, multiple colors and background shapes. This feature is only available on Stackable Premium', i18n ) }
			/> }

			{ applyFilters( 'stackable.block-component.icon.after', null ) }

			{ filteredColorTypes.length > 1 && (
				<AdvancedToolbarControl
					controls={ filteredColorTypes }
					isSmall={ true }
					fullwidth={ false }
					attribute="iconColorType"
				/>
			) }

			{ showIconControl && colorControls }

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

			{ shapeColorControls }

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

	const iconBackgroundShapeControls = (
		<ProControl
			title={ __( 'Say Hello to Background Shapes 👋', i18n ) }
			description={ __( 'Liven up your icons with gradient fills, multiple colors and background shapes. This feature is only available on Stackable Premium', i18n ) }
		/>
	)

	const Wrapper = wrapInPanels ? InspectorStyleControls : Fragment

	return (
		<Wrapper>
			{ wrapInPanels
				? <PanelAdvancedSettings title={ __( 'Icon', i18n ) } id="icon" initialOpen={ initialOpen } isOpen={ true } >{ iconControls }</PanelAdvancedSettings>
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
							? <PanelAdvancedSettings title={ __( 'Background Shape', i18n ) } id="icon-background-shape" > { iconBackgroundShapeControls }</PanelAdvancedSettings>
							: iconBackgroundShapeControls
					) }

					{ isPro && applyFilters( 'stackable.block-component.icon.edit.background-shape', null, {
						...props, getAttribute, updateAttributeHandler,
					} ) }
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
}
