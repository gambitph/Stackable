/**
 * Internal dependencies
 */
import './editor-loader'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, TypographyControl, AdvancedSelectControl, ControlSeparator,
} from '~stackable/components'
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
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { loadPromise, models } from '@wordpress/api'
import { addFilter, doAction } from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'

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

	// Generate our preview styles.
	const styles = {
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"]` ]: createTypographyStyles( '%s', 'desktop', props.styles, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"]:not([data-device="desktop"])` ]: createTypographyStyles( '%s', 'tablet', props.styles, { important: true } ),
		[ `.ugb-global-typography-preview__label[data-tag="${ props.tag }"][data-device="mobile"]` ]: createTypographyStyles( '%s', 'mobile', props.styles, { important: true } ),
	}

	// Load our Google Font is necessary.
	if ( props.styles.fontFamily ) {
		loadGoogleFont( props.styles.fontFamily )
	}

	return (
		<div className="ugb-global-typography-preview">
			<div className="editor-styles-wrapper">
				<div className="wp-block">
					<style>{ generateStyles( styles ) }</style>
					<Tag className="ugb-global-typography-preview__label" data-tag={ props.tag } data-device={ device }>{ props.children }</Tag>
				</div>
			</div>
			{ description && <p className="ugb-global-typography-preview__description">{ description }</p> }
		</div>
	)
}

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

const TYPOGRAPHY_TAGS = [
	{
		label: sprintf( __( 'Heading %d', i18n ), 1 ),
		tag: 'h1',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 2 ),
		tag: 'h2',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 3 ),
		tag: 'h3',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 4 ),
		tag: 'h4',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 5 ),
		tag: 'h5',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 6 ),
		tag: 'h6',
	},
]

let saveThrottle = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-typography', output => {
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )

	useEffect( () => {
		// Get settings.
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setTypographySettings( ( response.stackable_global_typography && response.stackable_global_typography[ 0 ] ) || {} )
				setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			} )
		} )
	}, [] )

	// When typography styles are changed, trigger our editor style generator to update.
	useEffect( () => {
		doAction( 'stackable.global-settings.typography.update-trigger', typographySettings, applySettingsTo )
	}, [ typographySettings, applySettingsTo ] )

	const changeStyles = ( tag, styles ) => {
		const newSettings = {
			...typographySettings,
			[ tag ]: styles,
		}
		setTypographySettings( newSettings )

		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const resetStyles = tag => {
		const newSettings = omit( typographySettings, [ tag ] )
		setTypographySettings( newSettings )

		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const changeApplySettingsTo = value => {
		setApplySettingsTo( value )
		const model = new models.Settings( {
			stackable_global_typography_apply_to: value, // eslint-disable-line
		} )
		model.save()
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Typography', i18n ) }
				initialOpen={ false }
			>
				<p className="components-base-control__help">
					{ __( 'Change the typography of your headings for all your blocks in your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-typography/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Typography', i18n ) }
					</a>
				</p>
				<AdvancedSelectControl
					label={ __( 'Apply Typography Styles to', i18n ) }
					options={ [
						{ value: 'blocks-stackable-native', label: __( 'Stackable and native blocks only', i18n ) },
						{ value: 'blocks-stackable', label: __( 'Stackable blocks only', i18n ) },
						{ value: 'blocks-all', label: __( 'Stackable and all other blocks', i18n ) },
						{ value: 'site', label: __( 'Entire Site (All blocks, header & footer)', i18n ) },
					] }
					value={ applySettingsTo }
					onChange={ changeApplySettingsTo }
				/>
				<ControlSeparator />
				{ TYPOGRAPHY_TAGS.map( ( { label, tag }, index ) => {
					return (
						<TypographyPicker
							key={ index }
							label={ label }
							tag={ tag }
							value={ ( typographySettings[ tag ] ) || {} }
							onChange={ value => changeStyles( tag, value ) }
							onReset={ () => resetStyles( tag ) }
						/>
					)
				} ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )
