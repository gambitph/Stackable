/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import { useAttributeEditHandlers } from '~stackable/hooks'
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
import { getAttributeName, getAttrNameFunction } from '~stackable/util'
import { escapeHTMLIfInvalid } from './util'

/**
 * WordPress dependencies
 */
import {
	useEffect, useState, useCallback, memo,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

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
		blockState,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const attributeName = getAttrNameFunction( attrNameTemplate )
	const text = getAttribute( 'text' )
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

	const onChangeContent = useCallback( text => setDebouncedText( escapeHTMLIfInvalid( text ) ), [] )

	return (
		<>
			{ applyFilters( 'stackable.block-component.typography.before', null, props ) }
			{ hasTextContent && (
				<AdvancedTextControl
					label={ __( 'Content', i18n ) }
					hasPanelModifiedIndicator={ false }
					isMultiline={ isMultiline }
					value={ unescape( debouncedText ) }
					onChange={ onChangeContent }
					/**
					 * Pass the unescaped Dynamic Content `onChange` function.
					 *
					 * @param {string} text Text with dynamic content.
					 */
					changeDynamicContent={ setDebouncedText }
					isDynamic={ true }
				/>
			) }
			{ hasRemoveMargins && (
				<AdvancedToggleControl
					label={ __( 'Use theme heading margins', i18n ) }
					attribute={ attributeName( 'useThemeTextMargins' ) }
				/>
			) }

			{ hasTextTag && (
				<HeadingButtonsControl
					attribute={ attributeName( 'textTag' ) }
					hasP={ getAttribute( 'hasP' ) }
				/>
			) }

			<ButtonIconPopoverControl
				label={ __( 'Typography', i18n ) }
				popoverLabel={ __( 'Typography', i18n ) }
				onReset={ () => {
					updateAttributes( {
						[ getAttributeName( 'fontFamily' ) ]: '',
						[ getAttributeName( 'fontWeight', 'desktop', blockState ) ]: '',
						[ getAttributeName( 'textTransform', 'desktop', blockState ) ]: '',
						[ getAttributeName( 'letterSpacing', 'desktop', blockState ) ]: '',
						[ getAttributeName( 'letterSpacing', 'tablet', blockState ) ]: '',
						[ getAttributeName( 'letterSpacing', 'mobile', blockState ) ]: '',
						[ getAttributeName( 'lineHeight', 'desktop', blockState ) ]: '',
						[ getAttributeName( 'lineHeight', 'tablet', blockState ) ]: '',
						[ getAttributeName( 'lineHeight', 'mobile', blockState ) ]: '',
					} )
				} }
				allowReset={
					( getAttribute( 'fontFamily' ) ||
						getAttribute( 'fontWeight', 'desktop', blockState ) ||
						getAttribute( 'textTransform', 'desktop', blockState ) ||
						getAttribute( 'letterSpacing', 'desktop', blockState ) ||
						getAttribute( 'letterSpacing', 'tablet', blockState ) ||
						getAttribute( 'letterSpacing', 'mobile', blockState ) ||
						getAttribute( 'lineHeight', 'desktop', blockState ) ||
						getAttribute( 'lineHeight', 'tablet', blockState ) ||
						getAttribute( 'lineHeight', 'mobile', blockState ) )
				}
			>
				<FontFamilyControl
					label={ __( 'Font Family', i18n ) }
					onChange={ updateAttributeHandler( 'fontFamily' ) }
					value={ getAttribute( 'fontFamily' ) }
					helpTooltip={ {
						video: 'typography-family',
						description: __( 'Sets the font set to be used for the element', i18n ),
					} }
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
					helpTooltip={ {
						video: 'typography-weight',
						title: __( 'Font weight', i18n ),
						description: __( 'Sets the thinness or thickness of text characters', i18n ),
					} }
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
					helpTooltip={ {
						video: 'typography-transform',
						title: __( 'Transform', i18n ),
						description: __( 'Sets the usage of upper or lower case', i18n ),
					} }
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
					helpTooltip={ {
						video: 'typography-line-height',
						title: __( 'Line height', i18n ),
						description: __( 'Sets the vertical distance between lines of text', i18n ),
					} }
				/>
				<AdvancedRangeControl
					label={ __( 'Letter Spacing', i18n ) }
					attribute={ attributeName( 'letterSpacing' ) }
					min={ -5 }
					sliderMax={ 10 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="0"
					responsive="all"
					helpTooltip={ {
						video: 'typography-letter-spacing',
						title: __( 'Letter spacing', i18n ),
						description: __( 'Sets the distance or space between letters', i18n ),
					} }
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
				helpTooltip={ {
					// TODO: Add a working video.
					title: __( 'Font size', i18n ),
					description: __( 'Sets the size of text characters', i18n ),
				} }
			/>

			{ hasColor && (
				<>
					{ hasGradient && (
						<AdvancedToolbarControl
							controls={ GRADIENT_OPTIONS }
							isSmall={ true }
							attribute={ attributeName( 'textColorType' ) }
						/>
					) }
					<ColorPaletteControl
						label={ __( 'Text Color', i18n ) }
						attribute={ attributeName( 'textColor1' ) }
						hover={ hasGradient && getAttribute( 'textColorType' ) === 'gradient' ? false : 'all' }
						isGradient={ getAttribute( 'textColorType' ) === 'gradient' }
					/>
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
					hasInset={ false }
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
	blockState: 'normal',
}

export const Edit = memo( props => {
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
		blockState,
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
				hasToggle={ hasToggle }
				{ ...( hasToggle ? {
					checked: getAttribute( attrNameTemplate !== '%s' ? 'show' : 'showText' ),
					onChange: updateAttributeHandler( attrNameTemplate !== '%s' ? 'show' : 'showText' ),
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
					blockState={ blockState }
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
} )

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
