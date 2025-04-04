/**
 * Internal dependencies
 */
import { GlobalTypographyStyles } from './editor-loader'
import TypographyPicker from './typography-picker'
import { getThemeStyles } from './get-theme-styles'
import FREE_FONT_PAIRS from './font-pairs.json'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, AdvancedSelectControl, ControlSeparator, FontPairPicker, ProControlButton,
} from '~stackable/components'
import { fetchSettings, getDefaultFontSize } from '~stackable/util'
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import { head, isEqual } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	Fragment, useEffect, useRef, useState,
} from '@wordpress/element'
import { models } from '@wordpress/api'
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'
import { dispatch, useSelect } from '@wordpress/data'

export { GlobalTypographyStyles }

const TYPOGRAPHY_TAGS = [
	{
		label: sprintf( __( 'Heading %d', i18n ), 1 ),
		selector: 'h1',
		presetName: '5XL',
		presetSlug: 'xxxxx-large',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 2 ),
		selector: 'h2',
		presetName: '4XL',
		presetSlug: 'xxxx-large',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 3 ),
		selector: 'h3',
		presetName: '3XL',
		presetSlug: 'xxx-large',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 4 ),
		selector: 'h4',
		presetName: '2XL',
		presetSlug: 'xx-large',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 5 ),
		selector: 'h5',
		presetName: 'XL',
		presetSlug: 'x-large',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 6 ),
		selector: 'h6',
		presetName: 'L',
		presetSlug: 'large',
	},
	{
		label: __( 'Body Text', i18n ),
		selector: 'p',
		presetName: 'M',
		presetSlug: 'medium',
	},
	{
		label: __( 'Subtitle', i18n ),
		selector: '.stk-subtitle',
		presetName: 'S',
		presetSlug: 'small',
		help: (
			<>
				{ sprintf( __( "To apply this typography style, just add `%s` in your block\'s Additional CSS classes. Also make sure that `%s` tag is set to avoid conflict with other typography styles", i18n ), 'stk-subtitle', 'p' ) }
			</> ),
	},
	{
		label: __( 'Button', i18n ),
		selector: '.stk-button__inner-text',
	},
]

const TYPE_SCALE = [
	{ label: __( 'None / Custom', i18n ), value: 1 },
	{ label: __( '1.067 - Minor Second', i18n ), value: 1.067 },
	{ label: __( '1.125 - Major Second', i18n ), value: 1.125 },
	{ label: __( '1.200 - Minor Third', i18n ), value: 1.2 },
	{ label: __( '1.250 - Major Third', i18n ), value: 1.25 },
	{ label: __( '1.333 - Perfect Fourth', i18n ), value: 1.333 },
	{ label: __( '1.414 - Augmented Fourth', i18n ), value: 1.414 },
	{ label: __( '1.500 - Perfect Fifth', i18n ), value: 1.5 },
	{ label: __( '1.618 - Golden Ratio', i18n ), value: 1.618 },
]

let saveTypographyThrottle = null
let saveSelectedFontPairThrottle = null
let saveCustomFontPairsThrottle = null
let saveTypographyAsPresetsThrottle = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-typography', output => {
	const { allCustomPresets, useTypographyAsPresets } = useSelect( select => {
		const _customPresetControls = select( 'stackable/global-preset-controls.custom' )?.getCustomPresetControls() ?? {}
		const _useTypographyAsPresets = select( 'stackable/global-preset-controls.custom' )?.getUseTypographyAsPresets() ?? false
		return { allCustomPresets: { ..._customPresetControls }, useTypographyAsPresets: _useTypographyAsPresets }
	}, [] )

	const FONT_PAIRS = applyFilters( 'stackable.global-settings.typography.font-pairs.premium-font-pairs', FREE_FONT_PAIRS )

	const [ isPanelOpen, setIsPanelOpen ] = useState( false )
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )
	const [ customFontPairs, setCustomFontPairs ] = useState( [] )
	const [ selectedFontPairName, setSelectedFontPairName ] = useState( '' )
	const [ isEditingFontPair, setIsEditingFontPair ] = useState( false )
	const [ selectedTypeScale, setSelectedTypeScale ] = useState( 1 )

	const fontPairContainerRef = useRef( null )

	useEffect( () => {
		fetchSettings().then( response => {
			// Get settings.
			const _typographySettings = ( head( response.stackable_global_typography ) ) || {}
			setTypographySettings( _typographySettings )
			setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			setCustomFontPairs( response.stackable_custom_font_pairs || [] )
			setSelectedFontPairName( response.stackable_selected_font_pair || '' )

			// Reversely compute the type scale from the font sizes
			// Check first if the units are rem
			if ( Object.values( _typographySettings ).every( setting => setting.fontSizeUnit === 'rem' ) ) {
				let typeScale = _typographySettings?.h6?.fontSize
				const computedApplied = getAppliedTypeScale( typeScale )

				const tags = Object.keys( _typographySettings )
				for ( const tag of tags ) {
					// If font size mismatch, set typography scale to None / Custom
					if ( _typographySettings[ tag ].fontSize !== computedApplied[ tag ].fontSize ) {
						typeScale = 1
					}
				}

				setSelectedTypeScale( typeScale )
			}
		} )
	}, [] )

	useEffect( () => {
		// When typography styles are changed, trigger our editor style generator to update.
		doAction( 'stackable.global-settings.typography.update-trigger', typographySettings, applySettingsTo )

		// Update the custom presets when using typography as presets
		if ( useTypographyAsPresets ) {
			const fontSizePresets = TYPOGRAPHY_TAGS
				.filter( ( { presetSlug } ) => !! presetSlug )
				.map( ( {
					selector, presetName, presetSlug,
				} ) => {
					const size = typographySettings[ selector ]?.fontSize ?? getDefaultFontSize( selector ) ?? 16
					const unit = typographySettings[ selector ]?.fontSizeUnit ?? 'px'
					return {
						name: presetName,
						slug: presetSlug,
						size: `${ size }${ unit }`,
					}
				} )
			// Add the preset for extra small
			let xSmallSize = typographySettings[ '.stk-subtitle' ]?.fontSize ?? getDefaultFontSize( '.stk-subtitle' ) ?? 16
			let xSmallUnit = typographySettings[ '.stk-subtitle' ]?.fontSizeUnit ?? 'px'
			if ( xSmallUnit === 'px' ) {
				xSmallSize = Math.pow( xSmallSize / 16, 2 )
				xSmallUnit = 'rem'
			} else {
				xSmallSize = Math.pow( xSmallSize, 2 )
			}

			fontSizePresets.push( {
				name: 'XS',
				slug: 'x-small',
				size: `${ xSmallSize }${ xSmallUnit ?? 'px' }`,
			} )
			// Reverse the presets so it's from smallest to biggest
			fontSizePresets.reverse()

			const newSettings = { ...allCustomPresets, fontSizes: fontSizePresets }

			clearTimeout( saveTypographyAsPresetsThrottle )
			saveTypographyAsPresetsThrottle = setTimeout( () => {
				const settings = new models.Settings( { stackable_global_custom_preset_controls: newSettings } ) // eslint-disable-line camelcase
				settings.save()
			}, 300 )

			dispatch( 'stackable/global-preset-controls.custom' ).updateCustomPresetControls( newSettings )
		}
	}, [ JSON.stringify( typographySettings ), applySettingsTo, useTypographyAsPresets ] )

	// Scroll to the selected font pair when Global Typography tab is toggled
	useEffect( () => {
		const container = fontPairContainerRef?.current
		if ( container && isPanelOpen ) {
			const selectedElement = container.querySelector( '.ugb-global-settings-font-pair__selected' )
			if ( selectedElement ) {
				const containerRect = container.getBoundingClientRect()
				const selectedRect = selectedElement.getBoundingClientRect()

				const offset = selectedRect.top - containerRect.top
				const scrollOffset = offset - ( container.clientHeight / 2 ) + ( selectedElement.clientHeight / 2 )
				container.scrollTop += scrollOffset
			}
		}
	}, [ isPanelOpen ] )

	const getCurrentFontPair = () => {
		return [ ...FONT_PAIRS, ...customFontPairs ].find( fontPair => fontPair.name === selectedFontPairName )
	}

	const getAppliedTypeScale = typeScale => ( {
		h1: { fontSize: Number( Math.pow( typeScale, 6 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h2: { fontSize: Number( Math.pow( typeScale, 5 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h3: { fontSize: Number( Math.pow( typeScale, 4 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h4: { fontSize: Number( Math.pow( typeScale, 3 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h5: { fontSize: Number( Math.pow( typeScale, 2 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h6: { fontSize: Number( typeScale.toFixed( 3 ) ), fontSizeUnit: 'rem' },
		p: { fontSize: 1, fontSizeUnit: 'rem' },
		'.stk-subtitle': { fontSize: Number( ( 1 / typeScale ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		'.stk-button__inner-text': { fontSize: 1, fontSizeUnit: 'rem' },

	} )

	const updateTypography = newSettings => {
		setTypographySettings( newSettings )

		clearTimeout( saveTypographyThrottle )
		saveTypographyThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const updateSelectedFontPair = name => {
		setSelectedFontPairName( name )

		clearTimeout( saveSelectedFontPairThrottle )
		saveSelectedFontPairThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_selected_font_pair: name, // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const updateCustomFontPairs = fontPairs => {
		setCustomFontPairs( fontPairs )

		clearTimeout( saveCustomFontPairsThrottle )
		saveCustomFontPairsThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_custom_font_pairs: [ ...fontPairs ] , // eslint-disable-line
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

	const updateTypeScale = value => {
		const typeScale = Number( value )
		if ( isNaN( typeScale ) ) {
			return
		}

		setSelectedTypeScale( typeScale )

		// Only update the typography settings if not None/Custom
		if ( typeScale !== 1 ) {
			const newSettings = getAppliedTypeScale( typeScale )
			changeStyles( newSettings )
		}
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

		// Update the global styles immediately when reset font size is triggered.
		if ( Object.values( typography ).some( styles => styles && ! styles.fontSize ) ) {
			doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )
		}

		updateTypography( newSettings )
	}

	const resetStyles = selector => {
		let newSettings = {}
		const currentFontPair = getCurrentFontPair()
		if ( ! isEditingFontPair && currentFontPair ) {
			newSettings = { ...typographySettings, [ selector ]: currentFontPair.typography[ selector ] }
		}

		doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )

		updateTypography( newSettings )
	}

	const getDefaultFontFamily = selector => {
		const currentFontPair = getCurrentFontPair()
		if ( ! isEditingFontPair && currentFontPair ) {
			return currentFontPair.typography[ selector ]?.fontFamily ?? ''
		}
	}

	const getIsAllowReset = selector => {
		const currentFontPair = getCurrentFontPair()
		const typographyStyle = typographySettings[ selector ]
		if ( ! isEditingFontPair && currentFontPair ) {
			const fontPairStyle = currentFontPair.typography[ selector ]
			if ( ! isEqual( fontPairStyle, typographyStyle ) && ! Array.isArray( typographyStyle ) ) {
				return true
			}
			return false
		} else if ( typographyStyle && ( typographyStyle.fontFamily ||
			typographyStyle.fontSize || typographyStyle.tabletFontSize || typographyStyle.mobileFontSize ||
			typographyStyle.fontWeight ||
			typographyStyle.textTransform ||
			typographyStyle.lineHeight || typographyStyle.tabletLineHeight || typographyStyle.mobileLineHeight ||
			typographyStyle.letterSpacing || typographyStyle.tabletLetterSpacing || typographyStyle.mobileLetterSpacing ) ) {
			return true
		}
		return false
	}

	const getIsChangeConfirmed = () => {
		// No need to confirm when the current font pair is custom
		// since changes are saved
		if ( customFontPairs.find( fontPair => fontPair.name === selectedFontPairName ) ) {
			return true
		}

		const isDirty = TYPOGRAPHY_TAGS.some( ( { selector } ) => {
			return getIsAllowReset( selector )
		} )

		if ( isDirty ) {
		// eslint-disable-next-line no-alert
			const confirmChange = window.confirm( __( 'Picking a new font pair will overwrite the existing typography settings. Are you sure?', i18n ) )
			return confirmChange
		}
		return true
	}

	const CustomFontPairPickers = applyFilters(
		'stackable.global-settings.typography.font-pairs.customPicker',
		Fragment,
	)

	const EditingFontPairPanel = applyFilters(
		'stackable.global-settings.typography.font-pairs.editingFontPairPanel',
		Fragment,
	)

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
				<style> { getThemeStyles() } </style>
				{ ! isEditingFontPair &&
					<>
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
							<h3>{ __( 'Preset Font Pairs' ) }</h3>
							{ isPro && applyFilters(
								'stackable.global-settings.typography.font-pairs.addFontPair',
								[ ...FONT_PAIRS, ...customFontPairs ],
								selectedFontPairName,
								newFontPair => {
									setIsEditingFontPair( true )
									updateSelectedFontPair( newFontPair.name )
									updateCustomFontPairs( [ newFontPair, ...customFontPairs ] )
								}
							) }
						</div>

						<div className="ugb-global-settings-font-pair__container" ref={ fontPairContainerRef }>
							{ /* Theme Default */ }
							<FontPairPicker
								key={ FONT_PAIRS[ 0 ].name }
								fontPair={ FONT_PAIRS[ 0 ] }
								isSelected={ selectedFontPairName === FONT_PAIRS[ 0 ].name }
								onClick={ () => {
									if ( ! getIsChangeConfirmed() ) {
										return
									}
									updateSelectedFontPair( FONT_PAIRS[ 0 ].name )
									changeStyles( FONT_PAIRS[ 0 ].typography )
								} }
							/>
							{ /* Custom Font Pairs */ }
							<CustomFontPairPickers
								customFontPairs={ customFontPairs }
								selected={ selectedFontPairName }
								onClick={ ( name, typography ) => {
									if ( ! getIsChangeConfirmed() ) {
										return
									}
									updateSelectedFontPair( name )
									changeStyles( typography )
								} }
								onEdit={ ( name, typography ) => {
									setIsEditingFontPair( true )
									updateSelectedFontPair( name )
									changeStyles( typography )
								} }
							/>
							{ /* Font Pair Presets */ }
							{ FONT_PAIRS.slice( 1 ).map( fontPair => {
								return <FontPairPicker
									key={ fontPair.name }
									fontPair={ fontPair }
									isSelected={ selectedFontPairName === fontPair.name }
									onClick={ () => {
										if ( ! getIsChangeConfirmed() ) {
											return
										}
										updateSelectedFontPair( fontPair.name )
										changeStyles( fontPair.typography )
									} }
								/>
							} ) }
						</div>
						{ showProNotice && <ProControlButton type="font-pairs" /> }
						<ControlSeparator />

						<h3>{ __( 'Typography Settings' ) }</h3>
						<AdvancedSelectControl
							label={ __( 'Type Scale', i18n ) }
							options={ TYPE_SCALE }
							value={ selectedTypeScale }
							onChange={ updateTypeScale }
							default={ 1 }
						/>
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
									defaultFontFamily={ getDefaultFontFamily( selector ) }
									isAllowReset={ getIsAllowReset( selector ) }
									onChange={ styles => {
										changeStyles( { [ selector ]: styles } )
										// Also set the typescale to None/Custom
										setSelectedTypeScale( 1 )
									} }
									onReset={ () => {
										resetStyles( selector )
										// Also set the typescale to None/Custom
										setSelectedTypeScale( 1 )
									} }
								/>
							)
						} ) }
					</>
				}

				{ isPro && isEditingFontPair &&
					<EditingFontPairPanel
						TypographyPicker={ TypographyPicker }
						TYPOGRAPHY_TAGS={ TYPOGRAPHY_TAGS }
						typographySettings={ typographySettings }
						customFontPairs={ customFontPairs }
						selectedFontPairName={ selectedFontPairName }
						changeStyles={ changeStyles }
						updateTypography={ updateTypography }
						updateCustomFontPairs={ updateCustomFontPairs }
						setIsEditingFontPair={ setIsEditingFontPair }
						onDelete={ updatedCustomFontPairs => {
							setIsEditingFontPair( false )
							updateSelectedFontPair( '' )
							updateCustomFontPairs( updatedCustomFontPairs )
						} }
						getIsAllowReset={ getIsAllowReset }
					/>
				}
			</PanelAdvancedSettings>
		</Fragment>
	)
}, 4 )
