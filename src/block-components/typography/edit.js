/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import { useAttributeEditHandlers, useBlockHoverState } from '~stackable/hooks'
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
	ShadowControl,
} from '~stackable/components'
import {
	getAttributeName, getAttrNameFunction, extractColor,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { escapeHTML } from '@wordpress/escape-html'
import { applyFilters } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'
import { getColorClassName } from '@wordpress/block-editor'

const TYPOGRAPHY_SHADOWS = [
	'none',
	'2px 2px 4px rgba(0, 0, 0, 0.2)',
	'6px 6px 4px rgba(120, 120, 120, 0.2)',
	'2px 4px 5px rgba(0, 0, 0, 0.4)',
	'0px 0px 5px rgba(0, 0, 0, 0.4)',
	'4px 4px 0px rgba(0, 0, 0, 1)',
	'0px 15px 14px rgba(18, 63, 82, 0.3)',
	'25px 10px 14px rgba(18, 63, 82, 0.3)',
	'25px 10px 30px rgba(18, 63, 82, 0.3)',
	'0px 0px 40px rgba(18, 63, 82, 0.6)',
	'0px 0px 62px rgba(71, 73, 79, 1)',
	'0px 0px 100px rgba(71, 73, 79, 1)',
]

const GRADIENT_OPTIONS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

export const Controls = props => {
	const {
		hasAlign,
		hasColor,
		hasTextTag,
		hasTextContent,
		hasRemoveMargins,
		attrNameTemplate,
		isMultiline,
		hasGradient,
		hasTextShadow,
		hasTextPrefix,
		hasTextSuffix,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const attributeName = getAttrNameFunction( attrNameTemplate )
	const colors = useSelect( select => select( 'core/block-editor' ).getSettings().colors ) || []
	const text = getAttribute( 'text' )
	const [ state ] = useBlockHoverState()
	const [ debouncedText, setDebouncedText ] = useState( text )

	useEffect( () => {
		if ( text !== debouncedText ) {
			setDebouncedText( text )
		}
	}, [ text ] )

	useEffect( () => {
		let timeout
		if ( debouncedText !== text ) {
			timeout = setTimeout( () => {
				updateAttribute( 'text', debouncedText )
			}, 300 )
		}

		return () => clearTimeout( timeout )
	}, [ updateAttribute, debouncedText, text ] )

	return (
		<>
			{ applyFilters( 'stackable.block-component.typography.before', null, props ) }
			{ hasTextContent && (
				<AdvancedTextControl
					label={ __( 'Content', i18n ) }
					isMultiline={ isMultiline }
					value={ unescape( debouncedText ) }
					onChange={ text => setDebouncedText( escapeHTML( text ) ) }
					/**
					 * Pass the unescaped Dynamic Content `onChange` function.
					 *
					 * @param {string} text Text with dynamic content.
					 */
					changeDynamicContent={ setDebouncedText }
					isDynamic={ true }
				/>
			) }
			{ hasTextPrefix && (
				<AdvancedTextControl
					label={ __( 'Prefix', i18n ) }
					attribute="textPrefix"
				/>
			) }
			{ hasTextSuffix && (
				<AdvancedTextControl
					label={ __( 'Suffix', i18n ) }
					attribute="textSuffix"
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
				<AdvancedSelectControl
					label={ __( 'Font Style', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'Normal', i18n ), value: 'normal' },
						{ label: __( 'Italic', i18n ), value: 'italic' },
						{ label: __( 'Oblique', i18n ), value: 'oblique' },
					] }
					attribute={ attributeName( 'fontStyle' ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Line-Height', i18n ) }
					attribute={ attributeName( 'lineHeight' ) }
					units={ [ 'px', 'em', 'rem' ] }
					min={ [ 1, 0.1 ] }
					sliderMax={ [ 100, 10 ] }
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
					sliderMax={ 10 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="0"
				/>
			</ButtonIconPopoverControl>

			<AdvancedRangeControl
				label={ __( 'Size', i18n ) }
				allowReset={ true }
				attribute={ attributeName( 'fontSize' ) }
				units={ [ 'px', 'em', 'rem' ] }
				min={ [ 0, 0 ] }
				sliderMax={ [ 150, 7 ] }
				step={ [ 1, 0.05 ] }
				placeholder={ props.sizePlaceholder }
				responsive="all"
			/>

			{ hasColor && (
				<>
					{ hasGradient && (
						<AdvancedToolbarControl
							controls={ GRADIENT_OPTIONS }
							isSmall={ true }
							fullwidth={ false }
							attribute={ attributeName( 'textColorType' ) }
						/>
					) }
					<ColorPaletteControl
						changeCallback={ _value => {
							if ( state !== 'normal' ) {
								return _value
							}
							const value = extractColor( _value )
							const colorSlug = colors.find( ( { color } ) => value === color )?.slug
							updateAttribute( 'textColorClass', colorSlug ? getColorClassName( 'color', colorSlug ) : '' )
							return _value
						} }
						label={ getAttribute( 'textColorType' ) === 'gradient' && hasGradient ? sprintf( __( 'Text Color #%s', i18n ), 1 )
							: __( 'Text Color', i18n ) }
						attribute={ attributeName( 'textColor1' ) }
						hover={ hasGradient && getAttribute( 'textColorType' ) === 'gradient' ? false : 'all' }
						hasTransparent={ getAttribute( 'textColorType' ) === 'gradient' }
					/>
					{ getAttribute( 'textColorType' ) === 'gradient' && hasGradient && (
						<>
							<ColorPaletteControl
								label={ sprintf( __( 'Text Color #%s', i18n ), 2 ) }
								attribute={ attributeName( 'textColor2' ) }
								hasTransparent={ true }
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
					{ applyFilters( 'stackable.block-component.typography.color.after', null, props ) }
				</>
			) }

			{ hasTextShadow && (
				<ShadowControl
					isFilter={ true }
					label={ __( 'Shadow / Outline', i18n ) }
					attribute={ attributeName( 'textShadow' ) }
					options={ TYPOGRAPHY_SHADOWS }
					placeholder=""
					hover="all"
				/>
			) }

			{ hasAlign && (
				<AlignButtonsControl
					label={ __( 'Align', i18n ) }
					attribute={ attributeName( 'textAlign' ) }
					responsive="all"
				/>
			) }
		</>
	)
}

Controls.defaultProps = {
	hasAlign: false,
	hasColor: true,
	hasTextTag: true,
	hasTextContent: true,
	hasRemoveMargins: false,
	attrNameTemplate: '%s',
	isMultiline: false,
	hasGradient: true,
	hasTextShadow: false,
	hasTextPrefix: false,
	hasTextSuffix: false,
}

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
		hasTextShadow,
		hasTextPrefix,
		hasTextSuffix,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( attrNameTemplate )

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
				<Controls
					hasAlign={ hasAlign }
					hasColor={ hasColor }
					hasTextTag={ hasTextTag }
					hasTextContent={ hasTextContent }
					hasRemoveMargins={ hasRemoveMargins }
					attrNameTemplate={ attrNameTemplate }
					isMultiline={ isMultiline }
					hasGradient={ hasGradient }
					hasTextShadow={ hasTextShadow }
					hasTextPrefix={ hasTextPrefix }
					hasTextSuffix={ hasTextSuffix }
				/>
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
	sizePlaceholder: '32',
	hasTextShadow: false,
}

Edit.Controls = Controls
