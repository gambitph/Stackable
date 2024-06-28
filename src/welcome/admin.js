/**
 * Internal dependencies
 */
import './news'
import SVGEssentialIcon from './images/settings-icon-essential.svg'
import SVGSpecialIcon from './images/settings-icon-special.svg'
import SVGSectionIcon from './images/settings-icon-section.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	useEffect, useState, Fragment, useCallback,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { Spinner, CheckboxControl } from '@wordpress/components'
import { loadPromise, models } from '@wordpress/api'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import {
	i18n,
	showProNoticesOption,
} from 'stackable'
import classnames from 'classnames'
import { importBlocks } from '~stackable/util/admin'
import { createRoot } from '~stackable/util/element'
import AdminSelectSetting from '~stackable/components/admin-select-setting'
import AdminToggleSetting from '~stackable/components/admin-toggle-setting'
import AdminTextSetting from '~stackable/components/admin-text-setting'
import { GettingStarted } from './getting-started'

const FREE_BLOCKS = importBlocks( require.context( '../block', true, /block\.json$/ ) )
export const getAllBlocks = () => applyFilters( 'stackable.settings.blocks', FREE_BLOCKS )

export const BLOCK_CATEROGIES = [
	{
		id: 'essential',
		label: __( 'Essential Blocks', i18n ),
		Icon: SVGEssentialIcon,
		description: __( 'All the necessary building blocks you need to design anything.', i18n ),
	},
	{
		id: 'special',
		label: __( 'Special Blocks', i18n ),
		Icon: SVGSpecialIcon,
		description: __( 'Blocks with special functionality that will allow you to create distinctive designs.', i18n ),
	},
	{
		id: 'section',
		label: __( 'Section Blocks', i18n ),
		Icon: SVGSectionIcon,
		description: __( 'Use these blocks act as templates to help you build sections effortlessly.', i18n ),
	},
]

const BlockList = () => {
	const DERIVED_BLOCKS = getAllBlocks()
	return (
		<>
			{ BLOCK_CATEROGIES.map( ( { id, label } ) => {
				return (
					<div className="s-getting-started-blocks-wrapper" key={ id }>
						<h3>{ label }</h3>
						<div className="s-getting-started-blocks">
							{ DERIVED_BLOCKS[ id ].map( ( block, i ) => {
								return (
									<div
										key={ i }
										className="s-box"
									>
										<h4>{
											// eslint-disable-next-line @wordpress/i18n-no-variables
											__( block.title, i18n )
										}</h4>
										<p>{
											// eslint-disable-next-line @wordpress/i18n-no-variables
											__( block.description, i18n )
										}</p>
										{ block[ 'stk-demo' ] && <a href={ block[ 'stk-demo' ] } target="_example">{ __( 'See example', i18n ) }</a> }
									</div>
								)
							} ) }
						</div>
					</div>
				)
			} ) }
		</>
	)
}

const BlockToggler = () => {
	const DERIVED_BLOCKS = getAllBlocks()
	const [ isSaving, setIsSaving ] = useState( false )
	const [ disabledBlocks, setDisabledBlocks ] = useState( [] )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setDisabledBlocks( response.stackable_disabled_blocks )
			} )
		} )
	}, [] )

	const save = ( disabledBlocks, type ) => {
		setIsSaving( type )
		const model = new models.Settings( { stackable_disabled_blocks: disabledBlocks } ) // eslint-disable-line camelcase
		model.save().then( () => setIsSaving( false ) )
	}

	const enableAllBlocks = type => () => {
		let newDisabledBlocks = [ ...disabledBlocks ]
		DERIVED_BLOCKS[ type ].forEach( block => {
			newDisabledBlocks = newDisabledBlocks.filter( blockName => blockName !== block.name )
		} )
		setDisabledBlocks( newDisabledBlocks )
		save( newDisabledBlocks, type )
	}

	const disableAllBlocks = type => () => {
		const newDisabledBlocks = [ ...disabledBlocks ]
		DERIVED_BLOCKS[ type ].forEach( block => {
			if ( ! newDisabledBlocks.includes( block.name ) ) {
				newDisabledBlocks.push( block.name )
			}
		} )
		setDisabledBlocks( newDisabledBlocks )
		save( newDisabledBlocks, type )
	}

	const toggleBlock = useCallback( ( name, type ) => {
		let newDisabledBlocks = null
		if ( disabledBlocks.includes( name ) ) {
			newDisabledBlocks = disabledBlocks.filter( block => block !== name )
		} else {
			newDisabledBlocks = [
				...disabledBlocks,
				name,
			]
		}
		setDisabledBlocks( newDisabledBlocks )
		save( newDisabledBlocks, type )
	}, [ setDisabledBlocks, disabledBlocks ] )

	return (
		<>
			{ BLOCK_CATEROGIES.map( ( {
				id, label, Icon,
			} ) => {
				const classes = classnames( [
					's-box-block__title',
					`s-box-block__title--${ id }`,
				] )
				return (
					<div className="s-box s-box-block" key={ id }>
						<h3 className={ classes }>
							{ Icon && <Icon height="20" width="20" /> }
							<span>{ label }</span>
						</h3>
						<div className="s-settings-header">
							{ isSaving === id && <Spinner /> }
							<button onClick={ enableAllBlocks( id ) } className="button button-large button-link">{ __( 'Enable All', i18n ) }</button>
							<button onClick={ disableAllBlocks( id ) } className="button button-large button-link">{ __( 'Disable All', i18n ) }</button>
						</div>
						<div className="s-settings-grid">
							{ DERIVED_BLOCKS[ id ].map( ( block, i ) => {
								const isDisabled = disabledBlocks.includes( block.name )

								const demoLink = block[ 'stk-demo' ] && (
									<a
										href={ block[ 'stk-demo' ] }
										target="_blank"
										rel="noopener noreferrer"
										onClick={ ev => ev.stopPropagation() }
									>
										{ __( 'view demo', i18n ) }
									</a>
								)

								const title = <>
									<span>{ __( block.title, i18n ) }</span> { /* eslint-disable-line @wordpress/i18n-no-variables */ }
									{ demoLink }
								</>

								return (
									<AdminToggleSetting
										key={ i }
										label={ title }
										value={ ! isDisabled }
										onChange={ () => {
											toggleBlock( block.name, id )
										} }
										size="small"
										disabled={ __( 'Disabled', i18n ) }
										enabled={ __( 'Enabled', i18n ) }
									/>
								)
							} ) }
						</div>
					</div>
				)
			} ) }
		</>
	)
}

// Implement pick without using lodash, because themes and plugins might remove
// lodash from the admin.
const pick = ( obj, keys ) => {
	return keys.reduce( ( acc, key ) => {
		if ( obj && obj.hasOwnProperty( key ) ) {
			acc[ key ] = obj[ key ]
		}
		return acc
	}, {} )
}

// Create an admin notice if there's an error fetching the settings.
const SettingsNotice = () => {
	const [ error, setError ] = useState( null )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().catch( error => {
				setError( error )
			} )
		} )
	}, [] )

	if ( ! error ) {
		return null
	}

	return (
		<div className="notice notice-error">
			<p>{ __( 'Error getting Stackable settings. We got the following error. Please contact your administrator.', i18n ) }</p>
			{ error.responseJSON.message && <p><strong>{ error.responseJSON.message }</strong></p> }
		</div>
	)
}

const EditorSettings = () => {
	const [ settings, setSettings ] = useState( {} )
	const [ isBusy, setIsBusy ] = useState( false )
	const [ saveTimeout, setSaveTimeout ] = useState( null )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setSettings( pick( response, [
					'stackable_google_maps_api_key',
					'stackable_enable_design_library',
					'stackable_optimize_inline_css',
					'stackable_block_default_width',
					'stackable_block_wide_width',
					'stackable_auto_collapse_panels',
					'stackable_enable_block_linking',
					'stackable_enable_carousel_lazy_loading',
				] ) )
			} )
		} )
	}, [] )

	return <>
		<AdminToggleSetting
			label={ __( 'Design Library', i18n ) }
			value={ settings.stackable_enable_design_library }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_enable_design_library: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_enable_design_library: value, // eslint-disable-line camelcase
				} )
			} }
			help={ __( 'Adds a button on the top of the editor which gives access to a collection of pre-made block designs.', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Optimize Inline CSS', i18n ) }
			value={ settings.stackable_optimize_inline_css }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_optimize_inline_css: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_optimize_inline_css: value, // eslint-disable-line camelcase
				} )
			} }
			help={ __( 'Optimize inlined CSS styles. If this is enabled, similar selectors will be combined together, helpful if you changed Block Defaults.', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Auto-Collapse Panels', i18n ) }
			value={ settings.stackable_auto_collapse_panels }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_auto_collapse_panels: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_auto_collapse_panels: value, // eslint-disable-line camelcase
				} )
			} }
			help={ __( 'Collapse other inspector panels when opening another, keeping only one open at a time.', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Block Linking (Beta)', i18n ) }
			value={ settings.stackable_enable_block_linking }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_enable_block_linking: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_enable_block_linking: value, // eslint-disable-line camelcase
				} )
			} }
			help={
				<>
					{ __( 'Gives you the ability to link columns. Any changes you make on one column will automatically get applied on the other columns.', i18n ) }
					&nbsp;
					<a target="_docs" href="https://docs.wpstackable.com/article/452-how-to-use-block-linking">{ __( 'Learn more', i18n ) }</a>
				</>
			}
		/>
		<AdminTextSetting
			label={ __( 'Nested Block Width', i18n ) }
			value={ settings.stackable_block_default_width }
			type="text"
			onChange={ value => {
				clearTimeout( saveTimeout )
				setSettings( {
					...settings,
					stackable_block_default_width: value, // eslint-disable-line camelcase
				} )
				setSaveTimeout( setTimeout( () => {
					setIsBusy( true )
					const model = new models.Settings( { stackable_block_default_width: value } ) // eslint-disable-line camelcase
					model.save().then( () => setIsBusy( false ) )
				}, 400 ) )
			} }
			help={ __( 'The width used when a Columns block has its Content Width set to center. This is automatically detected from your theme. You can adjust it if your blocks are not aligned correctly. In px, you can also use other units or use a calc() formula.', i18n ) }
		></AdminTextSetting>
		<AdminTextSetting
			label={ __( 'Nested Wide Block Width', i18n ) }
			value={ settings.stackable_block_wide_width }
			type="text"
			onChange={ value => {
				clearTimeout( saveTimeout )
				setSettings( {
					...settings,
					stackable_block_wide_width: value, // eslint-disable-line camelcase
				} )
				setSaveTimeout( setTimeout( () => {
					setIsBusy( true )
					const model = new models.Settings( { stackable_block_wide_width: value } ) // eslint-disable-line camelcase
					model.save().then( () => setIsBusy( false ) )
				}, 400 ) )
			} }
			help={ __( 'The width used when a Columns block has its Content Width set to wide. This is automatically detected from your theme. You can adjust it if your blocks are not aligned correctly. In px, you can also use other units or use a calc() formula.', i18n ) }
		/>
		<AdminTextSetting
			label={ __( 'Google Maps API Key', i18n ) }
			value={ settings.stackable_google_maps_api_key }
			type="text"
			onChange={ value => {
				clearTimeout( saveTimeout )
				setSettings( {
					...settings,
					stackable_google_maps_api_key: value, // eslint-disable-line camelcase
				} )
				setSaveTimeout(
					setTimeout( () => {
						setIsBusy( true )
						const model = new models.Settings( {
							stackable_google_maps_api_key: value, // eslint-disable-line camelcase
						} )
						model.save().then( () => setIsBusy( false ) )
					}, 400 )
				)
			} }
			help={
				<>
					{ __(
						'Adding a Google API Key enables additional features of the Stackable Map Block.',
						i18n
					) }
						&nbsp;
					<a href="https://docs.wpstackable.com/article/483-how-to-use-stackable-map-block#api-key" target="_blank" rel="noreferrer">{ __( 'Learn more', i18n ) }</a>
				</>
				 }
		/>
		<AdminToggleSetting
			label={ __( 'Lazy Load Images within Carousels', i18n ) }
			value={ settings.stackable_enable_carousel_lazy_loading }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_enable_carousel_lazy_loading: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_enable_carousel_lazy_loading: value, // eslint-disable-line camelcase
				} )
			} }
			help={ __( 'Disable this if you encounter layout or spacing issues when using images inside carousel-type blocks because of image lazy loading.', i18n ) }
		/>
		{ isBusy &&
			<div className="s-absolute-spinner">
				<Spinner />
			</div>
		}
	</>
}

const DynamicBreakpointsSettings = () => {
	const [ tabletBreakpoint, setTabletBreakpoint ] = useState( '' )
	const [ mobileBreakpoint, setMobileBreakpoint ] = useState( '' )
	const [ isReady, setIsReady ] = useState( false )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		setIsBusy( true )
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				const breakpoints = response.stackable_dynamic_breakpoints
				if ( breakpoints ) {
					setTabletBreakpoint( breakpoints.tablet || '' )
					setMobileBreakpoint( breakpoints.mobile || '' )
				}
				setIsReady( true )
				setIsBusy( false )
			} )
		} )
	}, [] )

	useEffect( () => {
		if ( isReady ) {
			const t = setTimeout( () => {
				setIsBusy( true )
				const model = new models.Settings( {
					stackable_dynamic_breakpoints: { // eslint-disable-line camelcase
						tablet: tabletBreakpoint,
						mobile: mobileBreakpoint,
					},
				} )
				model.save().then( () => setIsBusy( false ) )
			}, 400 )
			return () => clearTimeout( t )
		}
	}, [ tabletBreakpoint, mobileBreakpoint, isReady ] )

	return <Fragment>
		<div>
			<AdminTextSetting
				label={ __( 'Tablet Breakpoint', i18n ) }
				type="number"
				value={ tabletBreakpoint }
				onChange={ value => setTabletBreakpoint( value ) }
				placeholder="1024"
			> px</AdminTextSetting>
			<AdminTextSetting
				label={ __( 'Mobile Breakpoint', i18n ) }
				type="number"
				value={ mobileBreakpoint }
				onChange={ value => setMobileBreakpoint( value ) }
				placeholder="768"
			> px</AdminTextSetting>
		</div>
		{ isBusy &&
			<div className="s-absolute-spinner">
				<Spinner />
			</div>
		}
	</Fragment>
}

const GlobalSettings = () => {
	const [ forceTypography, setForceTypography ] = useState( false )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setForceTypography( !! response.stackable_global_force_typography )
			} )
		} )
	}, [] )

	const updateForceTypography = value => {
		const model = new models.Settings( { stackable_global_force_typography: value } ) // eslint-disable-line camelcase
		model.save()
		setForceTypography( value )
	}

	return <Fragment>
		<AdminToggleSetting
			label={ __( 'Force Typography Styles', i18n ) }
			value={ forceTypography }
			onChange={ updateForceTypography }
			disabled={ __( 'Not forced', i18n ) }
			enabled={ __( 'Force styles', i18n ) }
		/>
	</Fragment>
}

const IconSettings = () => {
	const [ faVersion, setFaVersion ] = useState( '' )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setFaVersion( response.stackable_icons_fa_free_version || '6.5.1' )
			} )
		} )
	}, [] )

	const updateFaVersion = value => {
		const model = new models.Settings( { stackable_icons_fa_free_version: value } ) // eslint-disable-line camelcase
		model.save()
		setFaVersion( value )
	}

	return <Fragment>
		<div className="s-icon-settings-fa-pro-version">
			<label className="ugb-admin-setting__label-wrapper" htmlFor="s-icon-settings-fa-pro-version">
				<span className="ugb-admin-setting__label"> { __( 'FontAwesome Icon Library Version', i18n ) }</span>
				<div className="ugb-admin-setting__field">
					<p>
						{ __( 'You are using the version set in your Font Awesome Pro Kit.', i18n ) }
					</p>
				</div>
			</label>
		</div>
		<div className="s-icon-settings-fa-free-version">
			<AdminSelectSetting
				label={ __( 'FontAwesome Icon Library Version', i18n ) }
				value={ faVersion }
				options={ [
					{
						name: '6.5.1',
						value: '6.5.1',
					},
					{
						name: '5.15.4',
						value: '5.15.4',
					},
				] }
				onChange={ updateFaVersion }
			/>
		</div>
	</Fragment>
}

const AdditionalOptions = props => {
	const [ helpTooltipsDisabled, setHelpTooltipsDisabled ] = useState( false )
	const [ generateNativeGlobalColors, setGenerateNativeGlobalColors ] = useState( false )
	const [ v2EditorBackwardCompatibility, setV2EditorBackwardCompatibility ] = useState( false )
	const [ v2EditorBackwardCompatibilityUsage, setV2EditorBackwardCompatibilityUsage ] = useState( false )
	const [ v2FrontendBackwardCompatibility, setV2FrontendBackwardCompatibility ] = useState( false )
	const [ showPremiumNotices, setShowPremiumNotices ] = useState( false )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		setIsBusy( true )
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setHelpTooltipsDisabled( response.stackable_help_tooltip_disabled === '1' )
				setGenerateNativeGlobalColors( !! response.stackable_global_colors_native_compatibility )
				setV2EditorBackwardCompatibility( response.stackable_v2_editor_compatibility === '1' )
				setV2EditorBackwardCompatibilityUsage( response.stackable_v2_editor_compatibility_usage === '1' )
				setV2FrontendBackwardCompatibility( response.stackable_v2_frontend_compatibility === '1' )
				setShowPremiumNotices( response.stackable_show_pro_notices === '1' )
				setIsBusy( false )
			} )
		} )
	}, [] )

	const updateSetting = settings => {
		setIsBusy( true )
		const model = new models.Settings( settings )
		model.save().then( () => setIsBusy( false ) )
	}

	return (
		<div>
			{ props.showProNoticesOption &&
				<CheckboxControl
					label={ __( 'Show "Go premium" notices', i18n ) }
					checked={ showPremiumNotices }
					onChange={ checked => {
						updateSetting( { stackable_show_pro_notices: checked ? '1' : '' } ) // eslint-disable-line camelcase
						setShowPremiumNotices( checked )
					} }
				/>
			}
			<CheckboxControl
				label={ __( 'Don\'t show help video tooltips', i18n ) }
				checked={ helpTooltipsDisabled }
				onChange={ checked => {
					updateSetting( { stackable_help_tooltip_disabled: checked ? '1' : '' } ) // eslint-disable-line camelcase
					setHelpTooltipsDisabled( checked )
				} }
			/>
			<CheckboxControl
				label={ __( 'Generate Global Colors for native blocks', i18n ) }
				help={ __( `When enabled, extra frontend CSS is generated to support Stackable global colors used in native blocks. If you don't use Stackable global colors in native blocks, simply toggle this OFF. Please note that Stackable global colors are no longer available for native blocks. To ensure your styles always look perfect, our auto-detect feature will activate this option whenever needed.`, i18n ) }
				checked={ generateNativeGlobalColors }
				onChange={ checked => {
					updateSetting( { stackable_global_colors_native_compatibility: checked } ) // eslint-disable-line camelcase
					setGenerateNativeGlobalColors( checked )
				} }
			/>
			<h3>{ __( '🏠 Migration Settings', i18n ) }</h3>
			<p>
				{ __( 'Migrating from version 2 to version 3?', i18n ) }
				&nbsp;
				<a target="_docs" href="https://docs.wpstackable.com/article/462-migrating-from-version-2-to-version-3?utm_source=wp-settings-migrating&utm_campaign=learnmore&utm_medium=wp-dashboard">{ __( 'Learn more about migration and the settings below', i18n ) }</a>
			</p>
			<CheckboxControl
				label={ __( 'Load version 2 blocks in the editor', i18n ) }
				checked={ v2EditorBackwardCompatibility }
				onChange={ checked => {
					const settings = { stackable_v2_editor_compatibility: checked ? '1' : '' } // eslint-disable-line camelcase
					if ( checked ) {
						settings.stackable_v2_editor_compatibility_usage = '' // eslint-disable-line camelcase
						setV2EditorBackwardCompatibilityUsage( false )
					}
					updateSetting( settings )
					setV2EditorBackwardCompatibility( checked )
				} }
			/>
			<CheckboxControl
				label={ __( 'Load version 2 blocks in the editor only when the page was using version 2 blocks', i18n ) }
				checked={ v2EditorBackwardCompatibilityUsage }
				onChange={ checked => {
					const settings = { stackable_v2_editor_compatibility_usage: checked ? '1' : '' } // eslint-disable-line camelcase
					if ( checked ) {
						settings.stackable_v2_editor_compatibility = '' // eslint-disable-line camelcase
						setV2EditorBackwardCompatibility( false )
					}
					updateSetting( settings )
					setV2EditorBackwardCompatibilityUsage( checked )
				} }
			/>
			<CheckboxControl
				disabled={ v2EditorBackwardCompatibility || v2EditorBackwardCompatibilityUsage }
				label={ __( 'Load version 2 frontend block stylesheet and scripts for backward compatibility', i18n ) }
				checked={ v2EditorBackwardCompatibility || v2EditorBackwardCompatibilityUsage || v2FrontendBackwardCompatibility }
				onChange={ checked => {
					updateSetting( { stackable_v2_frontend_compatibility: checked ? '1' : '' } ) // eslint-disable-line camelcase
					setV2FrontendBackwardCompatibility( checked )
				} }
			/>
			{ isBusy &&
				<div className="ugb--saving-wrapper">
					<Spinner />
				</div>
			}
		</div>
	)
}

AdditionalOptions.defaultProps = {
	showProNoticesOption: false,
}

// Load all the options into the UI.
domReady( () => {
	// This is for the getting started block list.
	if ( document.querySelector( '.s-getting-started__block-list' ) ) {
		createRoot(
			document.querySelector( '.s-getting-started__block-list' )
		).render(
			<BlockList />
		)
	}

	// All these below are for the settings page.
	if ( document.querySelector( '.s-settings-wrapper' ) ) {
		createRoot(
			document.querySelector( '.s-settings-wrapper' )
		).render(
			<BlockToggler />
		)
	}

	if ( document.querySelector( '.s-other-options-wrapper' ) ) {
		createRoot(
			document.querySelector( '.s-other-options-wrapper' )
		).render(
			<AdditionalOptions
				showProNoticesOption={ showProNoticesOption }
			/>
		)
	}

	if ( document.querySelector( '.s-settings-notice' ) ) {
		createRoot(
			document.querySelector( '.s-settings-notice' )
		).render(
			<SettingsNotice />
		)
	}

	if ( document.querySelector( '.s-editor-settings' ) ) {
		createRoot(
			document.querySelector( '.s-editor-settings' )
		).render(
			<EditorSettings />
		)
	}

	if ( document.querySelector( '.s-dynamic-breakpoints' ) ) {
		createRoot(
			document.querySelector( '.s-dynamic-breakpoints' )
		).render(
			<DynamicBreakpointsSettings />
		)
	}

	if ( document.querySelector( '.s-global-settings' ) ) {
		createRoot(
			document.querySelector( '.s-global-settings' )
		).render(
			<GlobalSettings />
		)
	}

	if ( document.querySelector( '.s-icon-settings-fa-version' ) ) {
		createRoot(
			document.querySelector( '.s-icon-settings-fa-version' )
		).render(
			<IconSettings />
		)
	}

	if ( document.querySelector( '.s-getting-started__body' ) ) {
		createRoot(
			document.querySelector( '.s-getting-started__body' )
		).render(
			<GettingStarted />
		)
	}
} )
