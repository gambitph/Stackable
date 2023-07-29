/**
 * Internal dependencies
 */
import './news'
import './wizard'
import SVGEssentialIcon from './images/settings-icon-essential.svg'
import SVGSpecialIcon from './images/settings-icon-special.svg'
import SVGSectionIcon from './images/settings-icon-section.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { pick } from 'lodash'
import {
	render, useEffect, useState, Fragment, useCallback,
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
	},
	{
		id: 'special',
		label: __( 'Special Blocks', i18n ),
		Icon: SVGSpecialIcon,
	},
	{
		id: 'section',
		label: __( 'Section Blocks', i18n ),
		Icon: SVGSectionIcon,
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
					'stackable_enable_navigation_panel',
					'stackable_block_default_width',
					'stackable_block_wide_width',
					'stackable_auto_collapse_panels',
					'stackable_enable_block_linking',
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
			label={ __( 'Navigation Panel', i18n ) }
			value={ settings.stackable_enable_navigation_panel }
			onChange={ value => {
				setIsBusy( true )
				const model = new models.Settings( { stackable_enable_navigation_panel: value } ) // eslint-disable-line camelcase
				model.save().then( () => setIsBusy( false ) )
				setSettings( {
					...settings,
					stackable_enable_navigation_panel: value, // eslint-disable-line camelcase
				} )
			} }
			help={ __( 'A block Navigation panel that floats at the bottom of the inspector that helps with adjusting the different blocks in your column layout.', i18n ) }
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

const AdditionalOptions = props => {
	const [ helpTooltipsDisabled, setHelpTooltipsDisabled ] = useState( false )
	const [ v1BackwardCompatibility, setV1BackwardCompatibility ] = useState( false )
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
				setHelpTooltipsDisabled( !! response.stackable_help_tooltip_disabled )
				setV1BackwardCompatibility( response.stackable_load_v1_styles === '1' )
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
			<CheckboxControl
				label={ __( 'Load version 1 block stylesheet for backward compatibility', i18n ) }
				checked={ v1BackwardCompatibility }
				onChange={ checked => {
					updateSetting( { stackable_load_v1_styles: checked ? '1' : '' } ) // eslint-disable-line camelcase
					setV1BackwardCompatibility( checked )
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
		render(
			<BlockList />,
			document.querySelector( '.s-getting-started__block-list' )
		)
	}

	// All these below are for the settings page.
	if ( document.querySelector( '.s-settings-wrapper' ) ) {
		render(
			<BlockToggler />,
			document.querySelector( '.s-settings-wrapper' )
		)
	}

	if ( document.querySelector( '.s-other-options-wrapper' ) ) {
		render(
			<AdditionalOptions
				showProNoticesOption={ showProNoticesOption }
			/>,
			document.querySelector( '.s-other-options-wrapper' )
		)
	}

	if ( document.querySelector( '.s-editor-settings' ) ) {
		render(
			<EditorSettings />,
			document.querySelector( '.s-editor-settings' )
		)
	}

	if ( document.querySelector( '.s-dynamic-breakpoints' ) ) {
		render(
			<DynamicBreakpointsSettings />,
			document.querySelector( '.s-dynamic-breakpoints' )
		)
	}

	if ( document.querySelector( '.s-global-settings' ) ) {
		render(
			<GlobalSettings />,
			document.querySelector( '.s-global-settings' )
		)
	}

	if ( document.querySelector( '.s-getting-started__body' ) ) {
		render(
			<GettingStarted />,
			document.querySelector( '.s-getting-started__body' )
		)
	}
} )
