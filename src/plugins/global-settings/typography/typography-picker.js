/**
 * External dependencies
 */
import { TypographyControl } from '~stackable/components'
import { generateStyles } from '~stackable/components/block-styles'
import {
	createTypographyStyles, loadGoogleFont,
} from '~stackable/util'
import { i18n } from 'stackable'
import { upperFirst, omit } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'

const TypographyPicker = props => {
	const { value } = props

	// On style change, gather all the styles then trigger the onChange.
	const onChange = ( style, value ) => {
		const newStyles = {
			...props.value,
			[ style ]: value,
		}
		props.onChange( newStyles )
	}

	// Typography preview label.
	const label = (
		<TypographyPreview
			tag={ props.tag }
			styles={ value }
		>
			{ props.label }
		</TypographyPreview>
	)

	const mainClasses = classnames( [
		'ugb-global-settings-typography-control',
	], {
		'ugb-global-settings-typography-control--with-description': createDescription( value ),
	} )

	return (
		<TypographyControl
			className={ mainClasses }
			label={ label }
			popoverLabel={ null }
			onChangeStyle={ false }
			showSecondFontSize={ false }
			allowReset={ true }
			fontFamily={ value.fontFamily }
			fontSize={ value.fontSize }
			htmlTag={ props.tag }
			tabletFontSize={ value.tabletFontSize }
			mobileFontSize={ value.mobileFontSize }
			fontSizeUnit={ value.fontSizeUnit }
			tabletFontSizeUnit={ value.tabletFontSizeUnit }
			mobileFontSizeUnit={ value.mobileFontSizeUnit }
			fontWeight={ value.fontWeight }
			textTransform={ value.textTransform }
			lineHeight={ value.lineHeight }
			tabletLineHeight={ value.tabletLineHeight }
			mobileLineHeight={ value.mobileLineHeight }
			lineHeightUnit={ value.lineHeightUnit }
			tabletLineHeightUnit={ value.tabletLineHeightUnit }
			mobileLineHeightUnit={ value.mobileLineHeightUnit }
			letterSpacing={ value.letterSpacing }
			onChangeFontFamily={ value => onChange( 'fontFamily', value ) }
			onChangeFontSize={ value => onChange( 'fontSize', value ) }
			onChangeTabletFontSize={ value => onChange( 'tabletFontSize', value ) }
			onChangeMobileFontSize={ value => onChange( 'mobileFontSize', value ) }
			onChangeFontSizeUnit={ value => onChange( 'fontSizeUnit', value ) }
			onChangeTabletFontSizeUnit={ value => onChange( 'tabletFontSizeUnit', value ) }
			onChangeMobileFontSizeUnit={ value => onChange( 'mobileFontSizeUnit', value ) }
			onChangeFontWeight={ value => onChange( 'fontWeight', value ) }
			onChangeTextTransform={ value => onChange( 'textTransform', value ) }
			onChangeLineHeight={ value => onChange( 'lineHeight', value ) }
			onChangeTabletLineHeight={ value => onChange( 'tabletLineHeight', value ) }
			onChangeMobileLineHeight={ value => onChange( 'mobileLineHeight', value ) }
			onChangeLineHeightUnit={ value => onChange( 'lineHeightUnit', value ) }
			onChangeTabletLineHeightUnit={ value => onChange( 'tabletLineHeightUnit', value ) }
			onChangeMobileLineHeightUnit={ value => onChange( 'mobileLineHeightUnit', value ) }
			onChangeLetterSpacing={ value => onChange( 'letterSpacing', value ) }
			onReset={ () => props.onReset( props.tag ) }
		/>
	)
}

TypographyPicker.defaultProps = {
	tag: 'h1',
	label: sprintf( __( 'Heading %d', i18n ), 1 ),
	onChange: () => {},
	onReset: () => {},
	value: {},
	letterSpacing: '',
}

export default TypographyPicker

/**
 * Creates a summary description of what the current font is.
 *
 * @param {Object} styleObject Our font styles
 * @param {string} device The current device to create the typography description for
 */
const createDescription = ( styleObject, device = 'desktop' ) => {
	const description = []
	if ( styleObject.fontFamily ) {
		description.push( styleObject.fontFamily )
	}
	if ( styleObject.fontSize ) {
		description.push( `${ styleObject.fontSize }${ styleObject.fontSizeUnit || 'px' }` )
	}

	// Show the correct font size when in tablet or mobile previews.
	if ( device === 'tablet' && styleObject.tabletFontSize ) {
		if ( styleObject.fontSize ) {
			description.pop()
		}
		description.push( `${ styleObject.tabletFontSize }${ styleObject.tabletFontSizeUnit || 'px' }` )
	} else if ( device === 'mobile' && ( styleObject.tabletFontSize || styleObject.mobileFontSize ) ) {
		if ( styleObject.fontSize ) {
			description.pop()
		}
		if ( styleObject.mobileFontSize ) {
			description.push( `${ styleObject.mobileFontSize }${ styleObject.mobileFontSizeUnit || 'px' }` )
		} else {
			description.push( `${ styleObject.tabletFontSize }${ styleObject.tabletFontSizeUnit || 'px' }` )
		}
	}

	if ( styleObject.fontWeight ) {
		description.push( styleObject.fontWeight )
	}
	if ( styleObject.textTransform ) {
		description.push( upperFirst( styleObject.textTransform ) )
	}

	return description.join( ', ' )
}

const TypographyPreview = props => {
	const Tag = props.tag
	const { device } = useSelect(
		select => ( {
			device: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType().toLowerCase(),
		} ),
		[]
	)
	const description = createDescription( props.styles, device )

	// Don't include the line-height since it can ruin our control.
	const stylesToRender = omit( props.styles, [ 'lineHeight', 'tabletLineHeight', 'mobileLineHeight' ] )

	// Generate our preview styles.
	const styles = {
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"]` ]: createTypographyStyles( '%s', 'desktop', stylesToRender, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"]:not([data-device="desktop"])` ]: createTypographyStyles( '%s', 'tablet', stylesToRender, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"][data-device="mobile"]` ]: createTypographyStyles( '%s', 'mobile', stylesToRender, { important: true } ),
	}

	// Load our Google Font is necessary.
	if ( props.styles.fontFamily ) {
		loadGoogleFont( props.styles.fontFamily )
	}

	return (
		<div className="ugb-global-typography-preview">
			<div className="editor-styles-wrapper">
				<div className="block-editor-block-list__layout">
					<div className="wp-block block-editor-block-list__block">
						<style>{ generateStyles( styles ) }</style>
						<Tag className="ugb-global-typography-preview__label" data-tag={ props.tag } data-device={ device }>{ props.children }</Tag>
					</div>
				</div>
			</div>
			{ description && <p className="ugb-global-typography-preview__description">{ description }</p> }
		</div>
	)
}
