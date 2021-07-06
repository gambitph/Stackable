/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers, useBlockHoverState, useFontLoader,
} from '~stackable/hooks'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToggleControl,
	AdvancedToolbarControl,
	AlignButtonsControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	FontFamilyControl,
	HeadingButtonsControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import {
	TextareaControl,
	TextControl,
} from '@wordpress/components'
import { escapeHTML } from '@wordpress/escape-html'

export const Edit = props => {
	const {
		hasColor,
		hasColumns,
		hasTextTag,
		hasTextContent,
		hasRemoveMargins,
		hasTopBottomLine,
		attrNameTemplate,
		isMultiline,
		initialOpen,
		hasGradient,
	} = props

	const TextInput = isMultiline ? TextareaControl : TextControl

	const {
		getAttribute,
		updateAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( attrNameTemplate )

	const [ state ] = useBlockHoverState()
	useFontLoader( getAttribute( 'fontFamily' ) )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Typography', i18n ) }
				initialOpen={ initialOpen }
				id="text"
			>
				<Fragment>
					{ hasColumns && (
						<Fragment>

							<AdvancedRangeControl
								label={ __( 'Columns', i18n ) }
								allowReset={ true }
								attribute="columns"
								min={ 1 }
								max={ 4 }
								step={ 1 }
								placeholder="1"
								responsive="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Column Gap', i18n ) }
								allowRest={ true }
								attribute="columnGap"
								min={ 0 }
								max={ 100 }
								responsive="all"
							/>

						</Fragment>
					) }
					{ hasTextContent && (
						<TextInput
							label={ __( 'Content', i18n ) }
							value={ unescape( getAttribute( 'text' ) ) }
							onChange={ value => updateAttribute( 'text', escapeHTML( value ) ) }
							placeholder={ __( 'Enter text here' ) }
						/>
					) }

					{ hasRemoveMargins && (
						<AdvancedToggleControl
							label={ __( 'Remove extra text margins', i18n ) }
							attribute="textRemoveTextMargins"
						/>
					) }

					{ hasTextTag && (
						<HeadingButtonsControl
							value={ getAttribute( 'textTag' ) }
							onChange={ updateAttributeHandler( 'textTag' ) }
							hasP={ false }
						/>
					) }

					<ButtonIconPopoverControl
						label={ __( 'Typography', i18n ) }
						popoverLabel={ __( 'Typography', i18n ) }
						onReset={ () => {
							updateAttributes( {
								[ getAttributeName( 'fontFamily' ) ]: '',
								[ getAttributeName( 'fontSize', 'desktop', state ) ]: '',
								[ getAttributeName( 'fontSize', 'tablet', state ) ]: '',
								[ getAttributeName( 'fontSize', 'mobile', state ) ]: '',
								[ getAttributeName( 'fontWeight', 'desktop', state ) ]: '',
								[ getAttributeName( 'textTransform', 'desktop', state ) ]: '',
								[ getAttributeName( 'letterSpacing', 'desktop', state ) ]: '',
								[ getAttributeName( 'lineHeight', 'desktop', state ) ]: '',
								[ getAttributeName( 'lineHeight', 'tablet', state ) ]: '',
								[ getAttributeName( 'lineHeight', 'mobile', state ) ]: '',
							} )
						} }
						allowReset={
							( getAttribute( 'fontFamily' ) ||
								getAttribute( 'fontSize', 'desktop', state ) ||
								getAttribute( 'fontSize', 'tablet', state ) ||
								getAttribute( 'fontSize', 'mobile', state ) ||
								getAttribute( 'fontWeight', 'desktop', state ) ||
								getAttribute( 'textTransform', 'desktop', state ) ||
								getAttribute( 'letterSpacing', 'desktop', state ) ||
								getAttribute( 'lineHeight', 'desktop', state ) ||
								getAttribute( 'lineHeight', 'tablet', state ) ||
								getAttribute( 'lineHeight', 'mobile', state ) )
						}
					>
						<FontFamilyControl
							label={ __( 'Font Family', i18n ) }
							onChange={ updateAttributeHandler( 'fontFamily' ) }
							value={ getAttribute( 'fontFamily' ) }
						/>
						<AdvancedRangeControl
							label={ __( 'Size', i18n ) }
							allowReset={ true }
							attribute="fontSize"
							units={ [ 'px', 'em' ] }
							min={ [ 0, 0 ] }
							max={ [ 150, 7 ] }
							step={ [ 1, 0.05 ] }
							placeholder="32"
							responsive="all"
							hover="all"
						/>
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
							attribute="fontWeight"
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
							attribute="textTransform"
						/>
						<AdvancedRangeControl
							label={ __( 'Line-Height', i18n ) }
							attribute="lineHeight"
							units={ [ 'px', 'em' ] }
							min={ [ 1, 0.1 ] }
							max={ [ 100, 10 ] }
							step={ [ 1, 0.1 ] }
							placeholder={ [ 30, 1.5 ] }
							allowReset={ true }
							initialPosition={ [ 37, 1.8 ] }
							responsive="all"
						/>
						<AdvancedRangeControl
							label={ __( 'Letter Spacing', i18n ) }
							attribute="letterSpacing"
							min={ -5 }
							max={ 10 }
							step={ 0.1 }
							allowReset={ true }
							placeholder="0"
						/>
					</ButtonIconPopoverControl>

					{ hasColor && (
						<Fragment>
							{ hasGradient && (
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
									attribute="textColorType"
									onReset={ () => {
										updateAttributes( {
											[ getAttributeName( 'textColor1' ) ]: '',
											[ getAttributeName( 'textColor2' ) ]: '',
										} )
									} }
								/>
							) }
							<ColorPaletteControl
								label={ getAttribute( 'textColorType' ) === 'gradient' && hasGradient ? sprintf( __( 'Text Color #%s', i18n ), 1 )
									: __( 'Text Color', i18n ) }
								attribute="textColor1"
								hover={ hasGradient && getAttribute( 'textColorType' ) === 'gradient' ? false : 'all' }
							/>
							{ getAttribute( 'textColorType' ) === 'gradient' && hasGradient && (
								<Fragment>
									<ColorPaletteControl
										label={ sprintf( __( 'Text Color #%s', i18n ), 2 ) }
										attribute="textColor2"
									/>

									<AdvancedRangeControl
										label={ __( 'Gradient Direction (degrees)', i18n ) }
										attribute="textGradientDirection"
										min={ 0 }
										max={ 360 }
										step={ 10 }
										allowReset={ true }
									/>
								</Fragment>
							) }
						</Fragment>
					) }
				</Fragment>

			</PanelAdvancedSettings>
			{ hasTopBottomLine && (
				<Fragment>

					<PanelAdvancedSettings
						title={ __( 'Top Line', i18n ) }
						id="top-line"
						hasToggle={ true }
						checked={ getAttribute( 'showTopLine' ) }
						onChange={ updateAttributeHandler( 'showTopLine' ) }
					>
						<ColorPaletteControl
							label={ __( 'Line Color', i18n ) }
							attribute="topLineColor"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Width', i18n ) }
							units={ [ 'px', '%' ] }
							attribute="topLineWidth"
							min={ 0 }
							max={ [ 500, 100 ] }
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Height', i18n ) }
							attribute="topLineHeight"
						/>

						<AdvancedRangeControl
							label={ __( 'Margin', i18n ) }
							attribute="topLineMargin"
							responsive="all"
							min={ 0 }
							max={ 100 }
						/>

						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							attribute="topLineAlign"
							responsive="all"
						/>

					</PanelAdvancedSettings>
					<PanelAdvancedSettings
						title={ __( 'Bottom Line', i18n ) }
						id="bottom-line"
						hasToggle={ true }
						checked={ getAttribute( 'showBottomLine' ) }
						onChange={ updateAttributeHandler( 'showBottomLine' ) }
					>

						<ColorPaletteControl
							label={ __( 'Line Color', i18n ) }
							attribute="bottomLineColor"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Width', i18n ) }
							units={ [ 'px', '%' ] }
							attribute="bottomLineWidth"
							min={ 0 }
							max={ [ 500, 100 ] }
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Height', i18n ) }
							attribute="bottomLineHeight"
						/>

						<AdvancedRangeControl
							label={ __( 'Margin', i18n ) }
							attribute="bottomLineMargin"
							responsive="all"
							min={ 0 }
							max={ 100 }
						/>

						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							attribute="bottomLineAlign"
							responsive="all"
						/>

					</PanelAdvancedSettings>

				</Fragment>
			) }
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasColor: true,
	hasColumns: false,
	hasTextTag: true,
	hasTextContent: true,
	hasTopBottomLine: false,
	attrNameTemplate: '%s',
	isMultiline: false,
	initialOpen: true,
	hasGradient: true,
	hasRemoveMargins: false,
}
