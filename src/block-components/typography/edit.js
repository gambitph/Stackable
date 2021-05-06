/**
 * External dependencies
 */
import { unescape } from 'lodash'
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
import { getDefaultFontSize } from '~stackable/util'

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
		enableTextTag = true,
	} = props

	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	const setAttributes = valueObject => updateBlockAttributes( clientId, valueObject )

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
							value={ attributes.textTag }
							onChange={ value => setAttributes( { textTag: value } ) }
						/>
					) }
					<TextareaControl
						label={ __( 'Text Content', i18n ) }
						value={ unescape( attributes.text ) }
						onChange={ value => setAttributes( { text: escapeHTML( value ) } ) }
					/>
					<ButtonIconPopoverControl
						label={ __( 'Typography', i18n ) }
						popoverLabel={ __( 'Typography', i18n ) }
						onReset={ () => {
							setAttributes( {
								fontFamily: '',
								fontSize: '',
								fontSizeUnit: 'px',
								tabletFontSize: '',
								tabletFontSizeUnit: 'px',
								mobileFontSize: '',
								mobileFontSizeUnit: 'px',
								fontWeight: '',
								textTransform: '',
								letterSpacing: '',
								lineHeight: '',
								tabletLineHeight: '',
								mobileLineHeight: '',
								lineHeightUnit: 'em',
								tabletLineHeightUnit: 'em',
								mobileLineHeightUnit: 'em',
							} )
						} }
						allowReset={
							( attributes.fontFamily ||
								attributes.fontSize ||
								attributes.tabletFontSize ||
								attributes.mobileFontSize ||
								attributes.fontWeight ||
								attributes.textTransform ||
								attributes.letterSpacing ||
								attributes.lineHeight ||
								attributes.tabletLineHeight ||
								attributes.mobileLineHeight )
						}
					>
						<FontFamilyControl
							label={ __( 'Font Family', i18n ) }
							onChange={ fontFamily => setAttributes( { fontFamily } ) }
							value={ attributes.fontFamily }
						/>
						<ResponsiveControl2
							desktopProps={ {
								onChange: value => setAttributes( { fontSize: value } ),
								value: attributes.fontSize,
								unit: attributes.fontSizeUnit,
								onChangeUnit: value => setAttributes( { fontSizeUnit: value } ),
							} }
							tabletProps={ {
								onChange: value => setAttributes( { tabletFontSize: value } ),
								value: attributes.tabletFontSize,
								unit: attributes.tabletFontSizeUnit,
								onChangeUnit: value => setAttributes( { tabletFontSizeUnit: value } ),
							} }
							mobileProps={ {
								onChange: value => setAttributes( { mobileFontSize: value } ),
								value: attributes.mobileFontSize,
								unit: attributes.mobileFontSizeUnit,
								onChangeUnit: value => setAttributes( { mobileFontSizeUnit: value } ),
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
							onChange={ value => setAttributes( { fontWeight: value } ) }
							value={ attributes.fontWeight }
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
							onChange={ value => setAttributes( { textTransform: value } ) }
							value={ attributes.textTransform }
						/>
						<ResponsiveControl2
							desktopProps={ {
								value: attributes.lineHeight,
								onChange: value => setAttributes( { lineHeight: value } ),
								unit: attributes.lineHeightUnit,
								onChangeUnit: value => setAttributes( { lineHeightUnit: value } ),
							} }
							tabletProps={ {
								value: attributes.tabletLineHeight,
								onChange: value => setAttributes( { tabletLineHeight: value } ),
								unit: attributes.tabletLineHeightUnit,
								onChangeUnit: value => setAttributes( { tabletLineHeightUnit: value } ),
							} }
							mobileProps={ {
								value: attributes.mobileLineHeight,
								onChange: value => setAttributes( { mobileLineHeight: value } ),
								unit: attributes.mobileLineHeightUnit,
								onChangeUnit: value => setAttributes( { mobileLineHeightUnit: value } ),
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
							onChange={ value => setAttributes( { letterSpacing: value } ) }
							value={ attributes.letterSpacing }
							placeholder="0"
						/>
					</ButtonIconPopoverControl>
					<ResponsiveControl2
						desktopProps={ {
							onChange: value => setAttributes( { fontSize: value } ),
							value: attributes.fontSize,
							unit: attributes.fontSizeUnit,
							onChangeUnit: value => setAttributes( { fontSizeUnit: value } ),
						} }
						tabletProps={ {
							onChange: value => setAttributes( { tabletFontSize: value } ),
							value: attributes.tabletFontSize,
							unit: attributes.tabletFontSizeUnit,
							onChangeUnit: value => setAttributes( { tabletFontSizeUnit: value } ),
						} }
						mobileProps={ {
							onChange: value => setAttributes( { mobileFontSize: value } ),
							value: attributes.mobileFontSize,
							unit: attributes.mobileFontSizeUnit,
							onChangeUnit: value => setAttributes( { mobileFontSizeUnit: value } ),
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
							value={ attributes.textColorType }
							onChange={ value => setAttributes( { textColorType: value } ) }
							onReset={ () => {
								setAttributes( {
									textColor1: '',
									textColor2: '',
								} )
							} }
						/>
						<ColorPaletteControl
							label={ attributes.textColorType === 'gradient' ? sprintf( __( 'Text Color #%s', i18n ), 1 )
								: __( 'Text Color', i18n ) }
							value={ attributes.textColor1 }
							onChange={ value => setAttributes( { textColor1: value } ) }
						/>
						{ attributes.textColorType === 'gradient' && (
							<Fragment>
								<ColorPaletteControl
									label={ __( 'Text Color #2', i18n ) }
									value={ attributes.textColor2 }
									onChange={ value => setAttributes( { textColor2: value } ) }
								/>

								<AdvancedRangeControl
									label={ __( 'Gradient Direction (degrees)', i18n ) }
									value={ attributes.textGradientDirection }
									onChange={ value => setAttributes( { textGradientDirection: value } ) }
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
							value: attributes.textAlign,
							onChange: value => setAttributes( { textAlign: value } ),
						} }
						tabletProps={ {
							value: attributes.tabletTextAlign,
							onChange: value => setAttributes( { tabletTextAlign: value } ),
						} }
						mobileProps={ {
							value: attributes.mobileTextAlign,
							onChange: value => setAttributes( { mobileTextAlign: value } ),
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
