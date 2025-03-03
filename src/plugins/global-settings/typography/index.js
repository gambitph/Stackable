/**
 * Internal dependencies
 */
import { GlobalTypographyStyles } from './editor-loader'
import TypographyPicker from './typography-picker'
import { getThemeStyles } from './get-theme-styles'
import FONT_PAIRS from './font-pairs.json'
import FontPairPicker from './font-pair-picker'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, AdvancedSelectControl, ControlSeparator, InspectorSubHeader, Button,
} from '~stackable/components'
import { fetchSettings, loadGoogleFont } from '~stackable/util'
import { i18n } from 'stackable'
import { omit, head } from 'lodash'
import classNames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	Fragment, useEffect, useMemo, useRef, useState,
} from '@wordpress/element'
import { models } from '@wordpress/api'
import { addFilter, doAction } from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'

export { GlobalTypographyStyles }

const TYPOGRAPHY_TAGS = [
	{
		label: sprintf( __( 'Heading %d', i18n ), 1 ),
		selector: 'h1',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 2 ),
		selector: 'h2',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 3 ),
		selector: 'h3',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 4 ),
		selector: 'h4',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 5 ),
		selector: 'h5',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 6 ),
		selector: 'h6',
	},
	{
		label: __( 'Subtitle', i18n ),
		selector: '.stk-subtitle',
		help: (
			<>
				{ sprintf( __( "To apply this typography style, just add `%s` in your block\'s Additional CSS classes. Also make sure that `%s` tag is set to avoid conflict with other typography styles", i18n ), 'stk-subtitle', 'p' ) }
			</> ),
	},
	{
		label: __( 'Body Text', i18n ),
		selector: 'p',
	},
]

let saveThrottle = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-typography', output => {
	const [ isPanelOpen, setIsPanelOpen ] = useState( false )
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )
	const [ customFontPairs, setCustomFontPairs ] = useState( [] )
	const [ selectedFontPairName, setSelectedFontPairName ] = useState( 'theme-default' )
	const [ editingFontPairName, setEditingFontPairName ] = useState( '' )

	const fontPairContainerRef = useRef( null )

	useEffect( () => {
		fetchSettings().then( response => {
			// Get settings.
			setTypographySettings( ( head( response.stackable_global_typography ) ) || {} )
			setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			setCustomFontPairs( response.stackable_custom_font_pairs || [] )
			setSelectedFontPairName( response.stackable_selected_font_pair || '' )
		} )
	}, [] )

	// When typography styles are changed, trigger our editor style generator to update.
	useEffect( () => {
		doAction( 'stackable.global-settings.typography.update-trigger', typographySettings, applySettingsTo )
	}, [ JSON.stringify( typographySettings ), applySettingsTo ] )

	// Scroll to the selected font pair when Global Typography tab is toggled
	useEffect( () => {
		const container = fontPairContainerRef?.current
		if ( container ) {
			const selectedElement = container.querySelector( '.ugb-global-settings-font-pair__selected' )
			if ( selectedElement ) {
				const containerRect = container.getBoundingClientRect()
				const selectedRect = selectedElement.getBoundingClientRect()
				container.scrollTop = selectedRect.top + ( selectedRect.height / 2 ) - containerRect.top - ( containerRect.height / 2 )
			}
		}
	}, [ isPanelOpen ] )

	const allFontPairs = useMemo( () => [
		FONT_PAIRS[ 0 ],
		...customFontPairs.map( fontPair => ( {
			...fontPair,
			isCustom: true,
		} ) ),
		...FONT_PAIRS.slice( 1 ),
	], [ customFontPairs ] )

	const changeFontPair = name => {
		setSelectedFontPairName( name )
		const model = new models.Settings( {
			stackable_selected_font_pair: name, // eslint-disable-line
		} )
		model.save()
	}

	const changeCustomFontPairs = fontPairs => {
		setCustomFontPairs( fontPairs )
		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_custom_font_pairs: [ ...fontPairs ] , // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const changeStyles = typography => {
		const newSettings = { ...typographySettings }

		Object.entries( typography ).forEach( ( [ selector, styles ] ) => {
			if ( ! selector || typeof styles !== 'object' ) {
				return
			}
			/**
			 * Delete the object keys with empty strings.
			 * Otherwise, the API will throw an error code 400
			 * because of incompatible schema type.
			 */
			Object.keys( styles ).forEach( key => {
				if ( styles[ key ] === '' ) {
					delete styles[ key ]
				}
			} )

			newSettings[ selector ] = styles
		} )

		setTypographySettings( newSettings )

		// Update the global styles immediately when reset font size is triggered.
		if ( Object.values( typography ).some( styles => styles && ! styles.fontSize ) ) {
			doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )
		}

		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )

		if ( editingFontPairName ) {
			const updatedCustomFontPairs = customFontPairs
				.map( fontPair => fontPair.name === editingFontPairName ? { ...fontPair, typography: newSettings } : fontPair )
			changeCustomFontPairs( updatedCustomFontPairs )
		}
	}

	const resetStyles = selector => {
		const newSettings = omit( typographySettings, [ selector ] )
		setTypographySettings( newSettings )
		doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )

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

	const addFontPair = () => {
		const newFontPair = {
			...allFontPairs.find( fontPair => fontPair.name === selectedFontPairName ),
			name: `custom-${ Math.floor( Math.random() * new Date().getTime() ) % 100000 }`,
		}

		setSelectedFontPairName( newFontPair.name )
		setEditingFontPairName( newFontPair.name )
		changeCustomFontPairs( [ newFontPair, ...customFontPairs ] )
	}

	const deleteFontPair = name => {
		// eslint-disable-next-line no-alert
		const confirmDelete = window.confirm( __( 'Are you sure you want to delete this font pair?', i18n ) )
		if ( ! confirmDelete ) {
			return
		}
		const updatedCustomFontPairs = customFontPairs.filter( fontPair => fontPair.name !== name )

		setSelectedFontPairName( '' )
		setEditingFontPairName( '' )
		changeCustomFontPairs( updatedCustomFontPairs )
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Typography', i18n ) }
				className="ugb-global-typography__panel"
				onToggle={ () => {
					setIsPanelOpen( prev => ! prev )
				} }
			>
				{ ! editingFontPairName &&
					<div>
						<p className="components-base-control__help">
							{ __( 'Change the typography of your headings for all your blocks in your site.', i18n ) }
							&nbsp;
							<a href="https://docs.wpstackable.com/article/363-how-to-use-global-typography?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
								{ __( 'Learn more about Global Typography', i18n ) }
							</a>
						</p>
						<AdvancedSelectControl
							label={ __( 'Apply Typography Styles to', i18n ) }
							options={ [
								{ value: 'blocks-stackable-native', label: __( 'Stackable and native blocks only', i18n ) },
								{ value: 'blocks-stackable', label: __( 'Stackable blocks only', i18n ) },
								{ value: 'blocks-all', label: __( 'Stackable and all other blocks', i18n ) },
							] }
							value={ applySettingsTo }
							onChange={ changeApplySettingsTo }
							default="blocks-stackable-native"
						/>
						<ControlSeparator />

						<div className="ugb-global-settings-font-pair__heading">
							<h3>Preset Font Pairs</h3>
							<Button
								className="ugb-global-settings-color-picker__add-button"
								onClick={ addFontPair }
								icon="plus-alt2"
							/>
						</div>

						<div className="ugb-global-settings-font-pair__container" ref={ fontPairContainerRef }>
							{ allFontPairs.map( fontPair => {
								const headingStyles = fontPair.typography.h1
								const paragraphStyles = fontPair.typography.p
								if ( headingStyles.fontFamily ) {
									loadGoogleFont( headingStyles.fontFamily )
								}
								if ( paragraphStyles.fontFamily ) {
									loadGoogleFont( paragraphStyles.fontFamily )
								}
								const label = (
									<div>
										<span
											style={ omit( { ...headingStyles }, [ 'fontSize', 'lineHeight' ] ) }
											className="ugb-global-settings-font-pair__label"
										>
											{ headingStyles.fontFamily ? headingStyles.fontFamily : 'Theme Heading Default' }
										</span>
										<span
											style={ omit( { ...paragraphStyles }, [ 'fontSize', 'lineHeight' ] ) }
											className="ugb-global-settings-font-pair__sub-label"
										>
											{ paragraphStyles?.fontFamily ? paragraphStyles?.fontFamily : 'Theme Body Default' }
										</span>
									</div>
								)

								const className = classNames( { 'ugb-global-settings-font-pair__selected': selectedFontPairName === fontPair.name } )

								return <FontPairPicker
									key={ fontPair.name }
									label={ label }
									isCustom={ fontPair?.isCustom ?? false }
									className={ className }
									onClick={ () => {
										changeFontPair( fontPair.name )
										changeStyles( fontPair.typography )
									} }
									onEdit={ () => {
										setEditingFontPairName( fontPair.name )
										changeFontPair( fontPair.name )
										changeStyles( fontPair.typography )
									} }
								/>
							} ) }
						</div>

						<ControlSeparator />
					</div>
				}
				{ editingFontPairName &&
					<InspectorSubHeader
						title="Editing Font Pair"
						onBack={ () => setEditingFontPairName( '' ) }
						onTrash={ () => deleteFontPair( editingFontPairName ) }
					/>
				}

				<h3>Typography Settings</h3>
				<style> { getThemeStyles() } </style>
				{ TYPOGRAPHY_TAGS.map( ( {
					label, selector, help,
				}, index ) => {
					return (
						<TypographyPicker
							help={ help }
							key={ index }
							label={ label }
							selector={ selector }
							value={ ( typographySettings[ selector ] ) || {} }
							onChange={ styles => changeStyles( { [ selector ]: styles } ) }
							onReset={ () => resetStyles( selector ) }
						/>
					)
				} ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )
