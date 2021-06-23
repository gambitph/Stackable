/**
 * External dependencies
 */
import { unescape } from 'lodash'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers, useBlockAttributes, useBlockHoverState,
} from '~stackable/hooks'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	AlignButtonsControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	FontFamilyControl,
	HeadingButtonsControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import {
	TextareaControl,
} from '@wordpress/components'
import { escapeHTML } from '@wordpress/escape-html'
import { useDispatch } from '@wordpress/data'
import { getAttributeName } from '~stackable/util'
import { useBlockEditContext } from '@wordpress/block-editor'

const TypographyControls = props => {
	const {
		label,
		enableTextTag = true,
		enableTextContent = true,
		disableAlign = false,
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const [ state ] = useBlockHoverState()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const setAttributes = useCallback( attrs => {
		updateBlockAttributes( clientId, attrs )
	}, [ clientId ] )

	return (
		<Fragment>
			{ enableTextTag && (
				<HeadingButtonsControl
					value={ attributes[ getAttributeName( 'textTag' ) ] }
					onChange={ value => setAttributes( { [ getAttributeName( 'textTag' ) ]: value } ) }
				/>
			) }
			{ enableTextContent && (
				<TextareaControl
					label={ sprintf( __( '%s Content', i18n ), label ) }
					value={ unescape( attributes[ getAttributeName( 'text' ) ] ) }
					onChange={ value => setAttributes( { [ getAttributeName( 'text' ) ]: escapeHTML( value ) } ) }
				/>
			) }
			<ButtonIconPopoverControl
				label={ __( 'Typography', i18n ) }
				popoverLabel={ __( 'Typography', i18n ) }
				onReset={ () => {
					setAttributes( {
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
					( attributes[ getAttributeName( 'fontFamily' ) ] ||
						attributes[ getAttributeName( 'fontSize', 'desktop', state ) ] ||
						attributes[ getAttributeName( 'fontSize', 'tablet', state ) ] ||
						attributes[ getAttributeName( 'fontSize', 'mobile', state ) ] ||
						attributes[ getAttributeName( 'fontWeight', 'desktop', state ) ] ||
						attributes[ getAttributeName( 'textTransform', 'desktop', state ) ] ||
						attributes[ getAttributeName( 'letterSpacing', 'desktop', state ) ] ||
						attributes[ getAttributeName( 'lineHeight', 'desktop', state ) ] ||
						attributes[ getAttributeName( 'lineHeight', 'tablet', state ) ] ||
						attributes[ getAttributeName( 'lineHeight', 'mobile', state ) ] )
				}
			>
				<FontFamilyControl
					label={ __( 'Font Family', i18n ) }
					onChange={ fontFamily => setAttributes( { [ getAttributeName( 'fontFamily' ) ]: fontFamily } ) }
					value={ attributes[ getAttributeName( 'fontFamily' ) ] }
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
					hover="all"
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
					hover="all"
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
					hover="all"
				/>
				<AdvancedRangeControl
					label={ __( 'Letter Spacing', i18n ) }
					attribute="letterSpacing"
					min={ -5 }
					max={ 10 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="0"
					hover="all"
				/>
			</ButtonIconPopoverControl>
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
				hover="all"
				onReset={ () => {
					setAttributes( {
						[ getAttributeName( 'textColor1', 'desktop', state ) ]: '',
						[ getAttributeName( 'textColor2', 'desktop', state ) ]: '',
					} )
				} }
			/>
			<ColorPaletteControl
				label={ attributes[ getAttributeName( 'textColorType', 'desktop', state ) ] === 'gradient' ? sprintf( __( '%s Color #%s', i18n ), label, 1 )
					: sprintf( __( '%s Color', i18n ), label ) }
				attribute="textColor1"
				hover="all"
			/>
			{ attributes[ getAttributeName( 'textColorType', 'desktop', state ) ] === 'gradient' && (
				<Fragment>
					<ColorPaletteControl
						label={ sprintf( __( '%s Color #2', i18n ), label ) }
						attribute="textColor2"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						attribute="textGradientDirection"
						hover="all"
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
					/>
				</Fragment>
			) }
			{ ! disableAlign && (
				<AlignButtonsControl
					label={ __( 'Align', i18n ) }
					attribute="textAlign"
					responsive="all"
				/>
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
		disableAlign = false,
		withToggle = false,
	} = props

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

				<TypographyControls
					enableTextTag={ enableTextTag }
					enableTextContent={ enableTextContent }
					attrNameTemplate={ attrNameTemplate }
					disableAlign={ disableAlign }
				/>

			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
