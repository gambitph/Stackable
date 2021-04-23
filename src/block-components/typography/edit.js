/**
 * External dependencies
 */
import { camelCase, unescape } from 'lodash'
import { i18n } from 'stackable'
import { useBlockAttributes } from '~stackable/hooks'
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
} from '~stackable/components'
import { __getValue, getDefaultFontSize } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	useBlockEditContext,
} from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { Fragment, useMemo } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { BaseControl, TextareaControl } from '@wordpress/components'
import { escapeHTML } from '@wordpress/escape-html'

export const Edit = props => {
	const {
		attrNameTemplate = '%s',
		enableTextTag = true,
	} = props

	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	const setAttributes = valueObject => updateBlockAttributes( clientId, valueObject )

	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( attributes, getAttrName, '' )

	const placeholder = useMemo( () => {
		if ( typeof props.placeholder === 'function' ) {
			// If the placeholder is a function, this means that it's computed based on the detected default font size.
			return props.fontSize || Math.round( props.placeholder( getDefaultFontSize( props.htmlTag, true ) ) )
		}
		// Use the given placeholder, or use the detected font size.
		return props.fontSize || props.placeholder || getDefaultFontSize( props.htmlTag, true )
	}, [ props.htmlTag, props.fontSize ] )

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Text', i18n ) }
					id="text"
				>
					{ enableTextTag && (
						<HeadingButtonsControl
							value={ getValue( 'textTag' ) }
							onChange={ value => setAttributes( { [ getAttrName( 'textTag' ) ]: value } ) }
						/>
					) }
					<TextareaControl
						label={ __( 'Text Content', i18n ) }
						value={ unescape( getValue( 'text' ) ) }
						onChange={ value => setAttributes( { [ getAttrName( 'text' ) ]: escapeHTML( value ) } ) }
					/>
					<ButtonIconPopoverControl
						label={ __( 'Typography', i18n ) }
						popoverLabel={ __( 'Typography', i18n ) }
						onReset={ () => {
							setAttributes( {
								[ getAttrName( 'fontFamily' ) ]: '',
								[ getAttrName( 'fontSize' ) ]: '',
								[ getAttrName( 'fontSizeUnit' ) ]: 'px',
								[ getAttrName( 'tabletFontSize' ) ]: '',
								[ getAttrName( 'tabletFontSizeUnit' ) ]: 'px',
								[ getAttrName( 'mobileFontSize' ) ]: '',
								[ getAttrName( 'mobileFontSizeUnit' ) ]: 'px',
								[ getAttrName( 'fontWeight' ) ]: '',
								[ getAttrName( 'textTransform' ) ]: '',
								[ getAttrName( 'letterSpacing' ) ]: '',
								[ getAttrName( 'lineHeight' ) ]: '',
								[ getAttrName( 'tabletLineHeight' ) ]: '',
								[ getAttrName( 'mobileLineHeight' ) ]: '',
								[ getAttrName( 'lineHeightUnit' ) ]: 'em',
								[ getAttrName( 'tabletLineHeightUnit' ) ]: 'em',
								[ getAttrName( 'mobileLineHeightUnit' ) ]: 'em',
							} )
						} }
						allowReset={
							( getValue( 'fontFamily' ) ||
								getValue( 'fontSize' ) ||
								getValue( 'tabletFontSize' ) ||
								getValue( 'mobileFontSize' ) ||
								getValue( 'fontWeight' ) ||
								getValue( 'textTransform' ) ||
								getValue( 'letterSpacing' ) ||
								getValue( 'lineHeight' ) ||
								getValue( 'tabletLineHeight' ) ||
								getValue( 'mobileLineHeight' ) )
						}
					>
						<FontFamilyControl
							label={ __( 'Font Family', i18n ) }
							onChange={ fontFamily => setAttributes( { [ getAttrName( 'fontFamily' ) ]: fontFamily } ) }
							value={ getValue( 'fontFamily' ) }
						/>
						<ResponsiveControl2
							desktopProps={ {
								onChange: value => setAttributes( { [ getAttrName( 'fontSize' ) ]: value } ),
								value: getValue( 'fontSize' ),
								unit: getValue( 'fontSizeUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'fontSizeUnit' ) ]: value } ),
							} }
							tabletProps={ {
								onChange: value => setAttributes( { [ getAttrName( 'TabletFontSize' ) ]: value } ),
								value: getValue( 'tabletFontSize' ),
								unit: getValue( 'tabletFontSizeUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'tabletFontSizeUnit' ) ]: value } ),
							} }
							mobileProps={ {
								onChange: value => setAttributes( { [ getAttrName( 'mobileFontSize' ) ]: value } ),
								value: getValue( 'mobileFontSize' ),
								unit: getValue( 'mobileFontSizeUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'mobileFontSizeUnit' ) ]: value } ),
							} }
						>
							<FontSizeControl
								label={ __( 'Size', i18n ) }
								allowReset={ true }
								placeholder={ placeholder }
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
							onChange={ value => setAttributes( { [ getAttrName( 'fontWeight' ) ]: value } ) }
							value={ getValue( 'fontWeight' ) }
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
							onChange={ value => setAttributes( { [ getAttrName( 'textTransform' ) ]: value } ) }
							value={ getValue( 'textTransform' ) }
						/>
						<ResponsiveControl2
							desktopProps={ {
								value: getValue( 'lineHeight' ),
								onChange: value => setAttributes( { [ getAttrName( 'lineHeight' ) ]: value } ),
								unit: getValue( 'lineHeightUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'lineHeightUnit' ) ]: value } ),
							} }
							tabletProps={ {
								value: getValue( 'tabletLineHeight' ),
								onChange: value => setAttributes( { [ getAttrName( 'tabletLineHeight' ) ]: value } ),
								unit: getValue( 'tabletLineHeightUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'tabletLineHeightUnit' ) ]: value } ),
							} }
							mobileProps={ {
								value: getValue( 'mobileLineHeight' ),
								onChange: value => setAttributes( { [ getAttrName( 'mobileLineHeight' ) ]: value } ),
								unit: getValue( 'mobileLineHeightUnit' ),
								onChangeUnit: value => setAttributes( { [ getAttrName( 'mobileLineHeightUnit' ) ]: value } ),
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
							onChange={ value => setAttributes( { [ getAttrName( 'letterSpacing' ) ]: value } ) }
							value={ getValue( 'letterSpacing' ) }
							placeholder="0"
						/>
					</ButtonIconPopoverControl>
					<ResponsiveControl2
						desktopProps={ {
							onChange: value => setAttributes( { [ getAttrName( 'fontSize' ) ]: value } ),
							value: getValue( 'fontSize' ),
							unit: getValue( 'fontSizeUnit' ),
							onChangeUnit: value => setAttributes( { [ getAttrName( 'fontSizeUnit' ) ]: value } ),
						} }
						tabletProps={ {
							onChange: value => setAttributes( { [ getAttrName( 'TabletFontSize' ) ]: value } ),
							value: getValue( 'tabletFontSize' ),
							unit: getValue( 'tabletFontSizeUnit' ),
							onChangeUnit: value => setAttributes( { [ getAttrName( 'tabletFontSizeUnit' ) ]: value } ),
						} }
						mobileProps={ {
							onChange: value => setAttributes( { [ getAttrName( 'mobileFontSize' ) ]: value } ),
							value: getValue( 'mobileFontSize' ),
							unit: getValue( 'mobileFontSizeUnit' ),
							onChangeUnit: value => setAttributes( { [ getAttrName( 'mobileFontSizeUnit' ) ]: value } ),
						} }
					>
						<FontSizeControl
							label={ __( 'Size', i18n ) }
							placeholder={ placeholder }
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
							value={ getValue( 'textColorType' ) }
							onChange={ value => setAttributes( { [ getAttrName( 'textColorType' ) ]: value } ) }
							onReset={ () => {
								setAttributes( {
									[ getAttrName( 'textColor1' ) ]: '',
									[ getAttrName( 'textColor2' ) ]: '',
								} )
							} }
						/>
						<ColorPaletteControl
							label={ getValue( 'textColorType' ) === 'gradient' ? sprintf( __( 'Text Color #%s', i18n ), 1 )
								: __( 'Text Color', i18n ) }
							value={ getValue( 'textColor1' ) }
							onChange={ value => setAttributes( { [ getAttrName( 'textColor1' ) ]: value } ) }
						/>
						{ getValue( 'textColorType' ) === 'gradient' && (
							<Fragment>
								<ColorPaletteControl
									label={ __( 'Text Color #2', i18n ) }
									value={ getValue( 'textColor2' ) }
									onChange={ value => setAttributes( { [ getAttrName( 'textColor2' ) ]: value } ) }
								/>

								<AdvancedRangeControl
									label={ __( 'Gradient Direction (degrees)', i18n ) }
									value={ getValue( 'textGradientDirection' ) }
									onChange={ value => setAttributes( { [ getAttrName( 'textGradientDirection' ) ]: value } ) }
									min={ 0 }
									max={ 360 }
									step={ 10 }
									allowReset={ true }
								/>
							</Fragment>
						) }
					</BaseControl>
					<ResponsiveControl2
						desktopProps={ {
							value: getValue( 'textAlign' ),
							onChange: value => setAttributes( { [ getAttrName( 'textAlign' ) ]: value } ),
						} }
						tabletProps={ {
							value: getValue( 'tabletTextAlign' ),
							onChange: value => setAttributes( { [ getAttrName( 'tabletTextAlign' ) ]: value } ),
						} }
						mobileProps={ {
							value: getValue( 'mobileTextAlign' ),
							onChange: value => setAttributes( { [ getAttrName( 'mobileTextAlign' ) ]: value } ),
						} }
					>
						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
						/>
					</ResponsiveControl2>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}
