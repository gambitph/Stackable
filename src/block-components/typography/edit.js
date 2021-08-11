/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers, useBlockHoverState, useFontLoader,
} from '~stackable/hooks'
import {
	AlignButtonsControl,
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedTextControl,
	AdvancedToggleControl,
	AdvancedToolbarControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	FontFamilyControl,
	HeadingButtonsControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { getAttributeName, getAttrNameFunction } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	useEffect, useState,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { escapeHTML } from '@wordpress/escape-html'

export const Edit = props => {
	const {
		hasAlign,
		hasColor,
		hasTextTag,
		hasTextContent,
		hasRemoveMargins,
		attrNameTemplate,
		isMultiline,
		initialOpen,
		hasGradient,
		hasToggle,
		label,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const attributeName = getAttrNameFunction( attrNameTemplate )

	const text = getAttribute( 'text' )

	const [ state ] = useBlockHoverState()
	const [ debouncedText, setDebouncedText ] = useState( text )
	useFontLoader( getAttribute( 'fontFamily' ) )

	/**
	 * Setter and getter for escaped/unscaped strings.
	 *
	 * Only allow escaping of characters when the user inputs inside the
	 * `TextControl`. We do this to avoid unnecessary escaping/unescaping of characters
	 * in side effects.
	 */
	const unescapedDebouncedText = unescape( debouncedText )
	const setDebouncedTextWithEscape = text => setDebouncedText( escapeHTML( text ) )

	useEffect( () => {
		if ( text !== debouncedText ) {
			setDebouncedText( text )
		}
	}, [ text ] )

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( debouncedText !== text ) {
				updateAttribute( 'text', debouncedText )
			}
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ debouncedText ] )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ label }
				initialOpen={ initialOpen }
				{ ...( hasToggle ? {
					checked: getAttribute( 'show' ),
					onChange: updateAttributeHandler( 'show' ),
				} : {} ) }
				id="text"
			>
				<>
					{ hasTextContent && (
						<AdvancedTextControl
							label={ __( 'Content', i18n ) }
							isMultiline={ isMultiline }
							value={ unescapedDebouncedText }
							onChange={ setDebouncedTextWithEscape }
							/**
							 * Pass the unescaped Dynamic Content `onChange` function.
							 */
							onChangeDynamicContent={ setDebouncedText }
							isDynamic={ true }
						/>
					) }

					{ hasRemoveMargins && (
						<AdvancedToggleControl
							label={ __( 'Remove extra text margins', i18n ) }
							attribute={ attributeName( 'textRemoveTextMargins' ) }
						/>
					) }

					{ hasTextTag && (
						<HeadingButtonsControl
							value={ getAttribute( 'textTag' ) }
							onChange={ updateAttributeHandler( 'textTag' ) }
							hasP={ getAttribute( 'hasP' ) }
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
							attribute={ attributeName( 'fontWeight' ) }
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
							attribute={ attributeName( 'textTransform' ) }
						/>
						<AdvancedRangeControl
							label={ __( 'Line-Height', i18n ) }
							attribute={ attributeName( 'lineHeight' ) }
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
							attribute={ attributeName( 'letterSpacing' ) }
							min={ -5 }
							max={ 10 }
							step={ 0.1 }
							allowReset={ true }
							placeholder="0"
						/>
					</ButtonIconPopoverControl>

					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						allowReset={ true }
						attribute={ attributeName( 'fontSize' ) }
						units={ [ 'px', 'em' ] }
						min={ [ 0, 0 ] }
						max={ [ 150, 7 ] }
						step={ [ 1, 0.05 ] }
						placeholder="32"
						responsive="all"
					/>

					{ hasColor && (
						<>
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
									attribute={ attributeName( 'textColorType' ) }
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
								attribute={ attributeName( 'textColor1' ) }
								hover={ hasGradient && getAttribute( 'textColorType' ) === 'gradient' ? false : 'all' }
							/>
							{ getAttribute( 'textColorType' ) === 'gradient' && hasGradient && (
								<>
									<ColorPaletteControl
										label={ sprintf( __( 'Text Color #%s', i18n ), 2 ) }
										attribute={ attributeName( 'textColor2' ) }
									/>

									<AdvancedRangeControl
										label={ __( 'Gradient Direction (degrees)', i18n ) }
										attribute={ attributeName( 'textGradientDirection' ) }
										min={ 0 }
										max={ 360 }
										step={ 10 }
										allowReset={ true }
									/>
								</>
							) }
						</>
					) }
				</>

				{ hasAlign && (
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						attribute={ attributeName( 'textAlign' ) }
						responsive="all"
					/>
				) }

			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasAlign: false,
	hasColor: true,
	hasTextTag: true,
	hasTextContent: true,
	attrNameTemplate: '%s',
	isMultiline: false,
	initialOpen: true,
	hasGradient: true,
	hasRemoveMargins: false,
	label: __( 'Typography', i18n ),
}
