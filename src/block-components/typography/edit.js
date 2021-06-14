/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import { useAttributeEditHandlers } from '~stackable/hooks'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	AlignButtonsControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	FontFamilyControl,
	FontSizeControl,
	HeadingButtonsControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ResponsiveControl2,
	TabbedLayout,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, useMemo, useState,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl, TextareaControl,
} from '@wordpress/components'
import { escapeHTML } from '@wordpress/escape-html'

const TypographyControls = props => {
	const {
		label,
		enableTextTag = true,
		enableTextContent = true,
		attrNameTemplate = '%s',
		disableAlign = false,
		blockElSelector,
	} = props

	const fontSizePlaceholder = useMemo( () => {
		return props.blockEl
			? () => props.blockEl.el() && parseFloat( window.getComputedStyle( blockElSelector ? props.blockEl.el().querySelector( blockElSelector ) : props.blockEl.el() ).fontSize )
			: null
	}, [ props.blockEl ] )

	const {
		getAttribute,
		updateAttribute,
		updateAttributes,
	} = useAttributeEditHandlers( attrNameTemplate )

	return (
		<Fragment>
			{ enableTextTag && (
				<HeadingButtonsControl
					value={ getAttribute( 'textTag' ) }
					onChange={ value => updateAttribute( 'textTag', value ) }
				/>
			) }
			{ enableTextContent && (
				<TextareaControl
					label={ sprintf( __( '%s Content', i18n ), label ) }
					value={ unescape( getAttribute( 'text' ) ) }
					onChange={ value => updateAttribute( 'text', escapeHTML( value ) ) }
				/>
			) }
			<ButtonIconPopoverControl
				label={ __( 'Typography', i18n ) }
				popoverLabel={ __( 'Typography', i18n ) }
				onReset={ () => {
					updateAttributes( {
						fontFamily: '',
						fontSize: '',
						fontSizeUnit: 'px',
						fontSizeTablet: '',
						fontSizeUnitTablet: 'px',
						fontSizeMobile: '',
						fontSizeUnitMobile: 'px',
						fontWeight: '',
						textTransform: '',
						letterSpacing: '',
						lineHeight: '',
						lineHeightTablet: '',
						lineHeightMobile: '',
						lineHeightUnit: 'em',
						lineHeightUnitTablet: 'em',
						lineHeightUnitMobile: 'em',
					} )
				} }
				allowReset={
					( getAttribute( 'fontFamily' ) ||
								getAttribute( 'fontSize' ) ||
								getAttribute( 'fontSizeTablet' ) ||
								getAttribute( 'fontSizeMobile' ) ||
								getAttribute( 'fontWeight' ) ||
								getAttribute( 'textTransform' ) ||
								getAttribute( 'letterSpacing' ) ||
								getAttribute( 'lineHeight' ) ||
								getAttribute( 'lineHeightTablet' ) ||
								getAttribute( 'lineHeightMobile' ) )
				}
			>
				<FontFamilyControl
					label={ __( 'Font Family', i18n ) }
					onChange={ fontFamily => updateAttribute( 'fontFamily', fontFamily ) }
					value={ getAttribute( 'fontFamily' ) }
				/>
				<ResponsiveControl2
					desktopProps={ {
						onChange: value => updateAttribute( 'fontSize', value ),
						value: getAttribute( 'fontSize' ),
						unit: getAttribute( 'fontSizeUnit' ),
						onChangeUnit: value => updateAttribute( 'fontSizeUnit', value ),
					} }
					tabletProps={ {
						onChange: value => updateAttribute( 'fontSizeTablet', value ),
						value: getAttribute( 'fontSizeTablet' ),
						unit: getAttribute( 'fontSizeUnitTablet' ),
						onChangeUnit: value => updateAttribute( 'fontSizeUnitTablet', value ),
					} }
					mobileProps={ {
						onChange: value => updateAttribute( 'fontSizeMobile', value ),
						value: getAttribute( 'fontSizeMobile' ),
						unit: getAttribute( 'fontSizeUnitMobile' ),
						onChangeUnit: value => updateAttribute( 'fontSizeUnitMobile', value ),
					} }
				>
					<FontSizeControl
						label={ __( 'Size', i18n ) }
						allowReset={ true }
						placeholderRender={ fontSizePlaceholder }
					/>
				</ResponsiveControl2>
				<AdvancedSelectControl
					label={ __( 'Weight', i18n ) }
					options={ [
						{ label: '100', value: '100' },
						{ label: '200', value: '200' },
						{ label: '300', value: '300' },
						{ label: '400', value: '400' },
						{ label: '500', value: '500' },
						{ label: '600', value: '600' },
						{ label: '700', value: '700' },
						{ label: '800', value: '800' },
						{ label: '900', value: '900' },
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'Normal', i18n ), value: 'normal' },
						{ label: __( 'Bold', i18n ), value: 'bold' },
					] }
					onChange={ value => updateAttribute( 'fontWeight', value ) }
					value={ getAttribute( 'fontWeight' ) }
				/>
				<AdvancedSelectControl
					label={ __( 'Transform', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'Uppercase', i18n ), value: 'uppercase' },
						{ label: __( 'Lowercase', i18n ), value: 'lowercase' },
						{ label: __( 'Capitalize', i18n ), value: 'capitalize' },
						{ label: __( 'None', i18n ), value: 'none' },
					] }
					onChange={ value => updateAttribute( 'textTransform', value ) }
					value={ getAttribute( 'textTransform' ) }
				/>
				<ResponsiveControl2
					desktopProps={ {
						value: getAttribute( 'lineHeight' ),
						onChange: value => updateAttribute( 'lineHeight', value ),
						unit: getAttribute( 'lineHeightUnit' ),
						onChangeUnit: value => updateAttribute( 'lineHeightUnit', value ),
					} }
					tabletProps={ {
						value: getAttribute( 'lineHeightTablet' ),
						onChange: value => updateAttribute( 'lineHeightTablet', value ),
						unit: getAttribute( 'lineHeightUnitTablet' ),
						onChangeUnit: value => updateAttribute( 'lineHeightUnitTablet', value ),
					} }
					mobileProps={ {
						value: getAttribute( 'lineHeightMobile' ),
						onChange: value => updateAttribute( 'lineHeightMobile', value ),
						unit: getAttribute( 'lineHeightUnitMobile' ),
						onChangeUnit: value => updateAttribute( 'lineHeightUnitMobile', value ),
					} }
				>
					<AdvancedRangeControl
						label={ __( 'Line-Height', i18n ) }
						units={ [ 'px', 'em' ] }
						min={ [ 1, 0.1 ] }
						max={ [ 100, 10 ] }
						step={ [ 1, 0.1 ] }
						palceholder={ [ 30, 1.5 ] }
						allowReset={ true }
						initialPosition={ [ 37, 1.8 ] }
					/>
				</ResponsiveControl2>
				<AdvancedRangeControl
					label={ __( 'Letter Spacing', i18n ) }
					min={ -5 }
					max={ 10 }
					step={ 0.1 }
					allowReset={ true }
					onChange={ value => updateAttribute( 'letterSpacing', value ) }
					value={ getAttribute( 'letterSpacing' ) }
					placeholder="0"
				/>
			</ButtonIconPopoverControl>
			<ResponsiveControl2
				desktopProps={ {
					onChange: value => updateAttribute( 'fontSize', value ),
					value: getAttribute( 'fontSize' ),
					unit: getAttribute( 'fontSizeUnit' ),
					onChangeUnit: value => updateAttribute( 'fontSizeUnit', value ),
				} }
				tabletProps={ {
					onChange: value => updateAttribute( 'fontSizeTablet', value ),
					value: getAttribute( 'fontSizeTablet' ),
					unit: getAttribute( 'fontSizeUnitTablet' ),
					onChangeUnit: value => updateAttribute( 'fontSizeUnitTablet', value ),
				} }
				mobileProps={ {
					onChange: value => updateAttribute( 'fontSizeMobile', value ),
					value: getAttribute( 'fontSizeMobile' ),
					unit: getAttribute( 'fontSizeUnitMobile' ),
					onChangeUnit: value => updateAttribute( 'fontSizeUnitMobile', value ),
				} }
			>
				<FontSizeControl
					label={ __( 'Size', i18n ) }
					placeholderRender={ fontSizePlaceholder }
					allowReset={ true }
				/>
			</ResponsiveControl2>
			<BaseControl
				id="stk-typography-color-type"
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
					isSmall={ true }
					fullwidth={ false }
					value={ getAttribute( 'textColorType' ) }
					onChange={ value => updateAttribute( 'textColorType', value ) }
					onReset={ () => {
						updateAttributes( {
							textColor1: '',
							textColor2: '',
						} )
					} }
				/>
				<ColorPaletteControl
					label={ getAttribute( 'textColorType' ) === 'gradient' ? sprintf( __( '%s Color #%s', i18n ), label, 1 )
						: sprintf( __( '%s Color', i18n ), label ) }
					value={ getAttribute( 'textColor1' ) }
					onChange={ value => updateAttribute( 'textColor1', value ) }
				/>
				{ getAttribute( 'textColorType' ) === 'gradient' && (
					<Fragment>
						<ColorPaletteControl
							label={ sprintf( __( '%s Color #2', i18n ), label ) }
							value={ getAttribute( 'textColor2' ) }
							onChange={ value => updateAttribute( 'textColor2', value ) }
						/>

						<AdvancedRangeControl
							label={ __( 'Gradient Direction (degrees)', i18n ) }
							value={ getAttribute( 'textGradientDirection' ) }
							onChange={ value => updateAttribute( 'textGradientDirection', value ) }
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
						/>
					</Fragment>
				) }
			</BaseControl>
			{ ! disableAlign && (
				<ResponsiveControl2
					desktopProps={ {
						value: getAttribute( 'textAlign' ),
						onChange: value => updateAttribute( 'textAlign', value ),
					} }
					tabletProps={ {
						value: getAttribute( 'textAlignTablet' ),
						onChange: value => updateAttribute( 'textAlignTablet', value ),
					} }
					mobileProps={ {
						value: getAttribute( 'textAlignMobile' ),
						onChange: value => updateAttribute( 'textAlignMobile', value ),
					} }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
					/>
				</ResponsiveControl2>
			) }
		</Fragment>
	)
}

TypographyControls.defaultProps = {
	label: __( 'Text', i18n ),
}

export const Edit = props => {
	const {
		enableTextTag = true,
		enableTextContent = true,
		attrNameTemplate = '%s',
		withHoverTab = false,
		hoverAttrNameTemplate = '%s',
		disableAlign = false,
		blockElSelector,
		withToggle = false,
	} = props

	const [ selectedTab, setSelectedTab ] = useState( 'normal' )

	const {
		getAttribute,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Text', i18n ) }
				id="text"
				{ ...{
					...( withToggle ? {
						hasToggle: withToggle,
						checked: getAttribute( 'showText' ),
						onChange: value => updateAttribute( 'showText', value ),
					} : {} ),
				} }
			>
				{ withHoverTab && (
					<TabbedLayout
						options={ [
							{
								label: __( 'Normal', i18n ),
								value: 'normal',
							},
							{
								label: __( 'Hover', i18n ),
								value: 'hover',
							},
						] }
						value={ selectedTab }
						onChange={ setSelectedTab }
					/>
				) }

				{ selectedTab === 'normal' && (
					<TypographyControls
						enableTextTag={ enableTextTag }
						enableTextContent={ enableTextContent }
						attrNameTemplate={ attrNameTemplate }
						disableAlign={ disableAlign }
						blockEl={ props.blockEl }
						blockElSelector={ blockElSelector }
					/>
				) }

				{ selectedTab === 'hover' && (
					<TypographyControls
						enableTextTag={ false }
						enableTextContent={ false }
						attrNameTemplate={ hoverAttrNameTemplate }
						disableAlign={ disableAlign }
						blockEl={ props.blockEl }
						blockElSelector={ blockElSelector }
						label={ __( 'Hover Text', i18n ) }
					/>
				) }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
