/**
 * External dependencies
 */
import { Tooltip, TypographyControl } from '~stackable/components'
import { createTypographyStyles, loadGoogleFont } from '~stackable/util'
import { i18n } from 'stackable'
import { upperFirst, omit } from 'lodash'
import classnames from 'classnames'
import { generateStyles } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { Dashicon } from '@wordpress/components'

const TypographyPicker = props => {
	const { value, help } = props

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
			selector={ props.selector }
			styles={ value }
			help={ help }
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
			fontSizeProps={ { units: [ 'px', 'em', 'rem' ] } }
			lineHeightUnits={ [ 'px', 'em', 'rem' ] }
			className={ mainClasses }
			label={ label }
			popoverLabel={ null }
			onChangeStyle={ false }
			showSecondFontSize={ false }
			allowReset={ true }
			fontFamily={ value.fontFamily }
			fontSize={ value.fontSize }
			htmlTag={ props.selector }
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
			tabletLetterSpacing={ value.tabletLetterSpacing }
			mobileLetterSpacing={ value.mobileLetterSpacing }
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
			onChangeTabletLetterSpacing={ value => onChange( 'tabletLetterSpacing', value ) }
			onChangeMobileLetterSpacing={ value => onChange( 'mobileLetterSpacing', value ) }
			onReset={ () => props.onReset( props.selector ) }
			resetPopoverTitle={ sprintf( __( 'Reset %s Global Typography Style', i18n ), props.selector === 'p' ? __( 'Body Text', i18n ) : props.selector.toUpperCase() ) }
			resetPopoverDescription={ __( 'Resetting this typography style will revert all typography to its original style. Proceed?', i18n ) }
		/>
	)
}

TypographyPicker.defaultProps = {
	selector: 'h1',
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
	const isSelectorTag = props.selector?.startsWith( '.' )
	const Tag = isSelectorTag ? 'p' : props.selector
	const tagClassName = classnames( [
		'ugb-global-typography-preview__label',
	], {
		[ props.selector?.substring( 1 ) ]: isSelectorTag,
	} )
	const { device } = useSelect(
		select => ( {
			device: select( 'core/editor' )?.getDeviceType?.()?.toLowerCase() ||
				select( 'core/edit-site' )?.__experimentalGetPreviewDeviceType?.()?.toLowerCase() ||
				select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.()?.toLowerCase() ||
				'desktop',
		} ),
		[]
	)
	const description = createDescription( props.styles, device )

	// Don't include the line-height since it can ruin our control.
	const stylesToRender = omit( props.styles, [ 'lineHeight', 'tabletLineHeight', 'mobileLineHeight' ] )

	// Generate our preview styles.
	const styles = {
		[ `.ugb-global-typography-preview__label[data-selector="${ props.selector }"]` ]: createTypographyStyles( '%s', 'desktop', stylesToRender, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-selector="${ props.selector }"]:not([data-device="desktop"])` ]: createTypographyStyles( '%s', 'tablet', stylesToRender, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-selector="${ props.selector }"][data-device="mobile"]` ]: createTypographyStyles( '%s', 'mobile', stylesToRender, { important: true } ),
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
						<style>{ generateStyles( styles ).join( '' ) }</style>
						<Tag className={ tagClassName } data-selector={ props.selector } data-device={ device }>{ props.children }</Tag>
					</div>
				</div>
				{ props.help && (
					<Tooltip
						position="bottom"
						text={ props.help }
					>
						<Dashicon icon="editor-help" />
					</Tooltip>
				) }
			</div>
			{ description && <p className="ugb-global-typography-preview__description">{ description }</p> }
		</div>
	)
}
