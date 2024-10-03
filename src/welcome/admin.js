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
	useEffect, useState, useCallback, useRef, useMemo, lazy, Suspense,
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
	isPro,
} from 'stackable'
import classnames from 'classnames'
import { importBlocks } from '~stackable/util/admin'
import { createRoot } from '~stackable/util/element'
import AdminSelectSetting from '~stackable/components/admin-select-setting'
import AdminToggleSetting from '~stackable/components/admin-toggle-setting'
import AdminTextSetting from '~stackable/components/admin-text-setting'
import AdvancedToolbarControl from '~stackable/components/advanced-toolbar-control'
import { GettingStarted } from './getting-started'
import { BLOCK_STATE } from '~stackable/util/blocks'

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

// Implement pick without using lodash, because themes and plugins might remove
// lodash from the admin.
// const pick = ( obj, keys ) => {
// 	return keys.reduce( ( acc, key ) => {
// 		if ( obj && obj.hasOwnProperty( key ) ) {
// 			acc[ key ] = obj[ key ]
// 		}
// 		return acc
// 	}, {} )
// }

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

// Create an admin notice if there's an error fetching the settings.
const RestSettingsNotice = () => {
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
			{ error.responseJSON &&
				<p><strong>{ error.responseJSON.data.status } ({ error.responseJSON.code }).</strong> { error.responseJSON.message } </p>
			}
		</div>
	)
}

const SaveSettingsNotice = ( ) => {
	const [ isDismissed, setIsDismissed ] = useState( false )

	if ( isDismissed ) {
		return null
	}

	return (
		<div className="notice notice-success is-dismissible" >
			<p>{ __( 'Settings saved.', i18n ) }</p>
			<button type="button" className="notice-dismiss" onClick={ () => setIsDismissed( true ) }>
				<span className="screen-reader-text">Dismiss this notice.</span>
			</button>
		</div>
	)
}

const Sidenav = ( {
	currentTab,
	onTabChange,
	handleSettingsSave,
} ) => {
	const tabList = useMemo( () => [
		{ id: 'editor-settings', label: __( 'Editor Settings', i18n ) },
		{ id: 'responsiveness', label: __( 'Responsiveness', i18n ) },
		{ id: 'blocks', label: __( 'Blocks', i18n ) },
		{ id: 'optimizations', label: __( 'Optimization', i18n ) },
		{ id: 'global-settings', label: __( 'Global Settings', i18n ) },
		{ id: 'role-manager', label: __( 'Role Manager', i18n ) },
		{ id: 'custom-fields-settings', label: __( 'Custom Fields', i18n ) },
		{ id: 'integrations', label: __( 'Integration', i18n ) },
		{ id: 'other-settings', label: __( 'Miscellaneous ', i18n ) },
	], [] )

	const sidenavRef = useRef( null )

	useEffect( () => {
		const handleScroll = () => {
			const header = document.querySelector( '.s-header-settings' )

			if ( header ) {
				// If the header is scrolled out of view, make the sidebar fixed
				if ( header.getBoundingClientRect().bottom <= 32 ) {
					sidenavRef.current.classList.add( 's-sidenav-fixed' )
				} else {
					sidenavRef.current.classList.remove( 's-sidenav-fixed' )
				}
			}
		}
		window.addEventListener( 'scroll', handleScroll )
		return () => window.removeEventListener( 'scroll', handleScroll )
	}, [] )

	return (
		<>
			<nav className="s-sidenav" ref={ sidenavRef }>
				<div>
					{ tabList.map( ( { id, label } ) => {
						return ( <button
							key={ id }
							className={ `s-sidenav-item ${ currentTab === id ? 's-active' : '' }` }
							onClick={ () => onTabChange( id ) }
							onKeyDown={ () => onTabChange( id ) }
							role="tab"
							tabIndex={ 0 }
						>
							{ label }
						</button>
						)
					} ) }
				</div>
				<button
					className="s-save-changes"
					onClick={ handleSettingsSave }
				>
					{ __( 'Save Changes', i18n ) }
				</button>
			</nav>
		</>
	)
}

// Main settings component
const Settings = () => {
	const [ settings, setSettings ] = useState( {} )
	const [ unsavedChanges, setUnsavedChanges ] = useState( {} )
	const [ currentTab, setCurrentTab ] = useState( 'editor-settings' )

	const handleSettingsChange = useCallback( newSettings => {
		setSettings( prev => ( { ...prev, ...newSettings } ) )
		setUnsavedChanges( prev => ( { ...prev, ...newSettings } ) )
	}, [] )

	const handleSettingsSave = useCallback( () => {
		console.log( settings ) // eslint-disable-line no-console
		if ( Object.keys( unsavedChanges ).length === 0 ) {
			return
		}
		const model = new models.Settings( unsavedChanges )
		model.save().then( () => {
			if ( document.querySelector( '.s-save-settings-notice' ) ) {
				createRoot(
					document.querySelector( '.s-save-settings-notice' )
				).render(
					<SaveSettingsNotice />
				)
				window.scrollTo( { top: 0, behavior: 'smooth' } )
			}
		} )
		setUnsavedChanges( {} )
	}, [ unsavedChanges, settings ] )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setSettings( response )
			} )
		} )
	}, [] )

	return <>
		<Sidenav currentTab={ currentTab } onTabChange={ setCurrentTab } handleSettingsSave={ handleSettingsSave } />
		<article className="s-box" id={ currentTab }>
			{ currentTab === 'editor-settings' && <EditorSettings { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'responsiveness' && <Responsiveness { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'blocks' && <Blocks { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'optimizations' && <Optimizations { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'global-settings' && <GlobalSettings { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'role-manager' && <RoleManager { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'custom-fields-settings' && <CustomFields { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'integrations' && <Integrations { ...{ settings, handleSettingsChange } } /> }
			{ currentTab === 'other-settings' && <AdditionalOptions showProNoticesOption={ showProNoticesOption } /> }
		</article>
	</>
}

const EditorSettings = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( 'Blocks', i18n ) }</h2>
		<p className="s-settings-subtitle">{ __( 'You can customize the default width of your blocks here.', i18n ) }</p>
		<AdminTextSetting
			label={ __( 'Nested Block Width', i18n ) }
			value={ settings.stackable_block_default_width }
			type="text"
			onChange={ value => {
				handleSettingsChange( { stackable_block_default_width: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'The width used when a Columns block has its Content Width set to center. This is automatically detected from your theme. You can adjust it if your blocks are not aligned correctly. In px, you can also use other units or use a calc() formula.', i18n ) }
		/>
		<AdminTextSetting
			label={ __( 'Nested Wide Block Width', i18n ) }
			value={ settings.stackable_block_wide_width }
			type="text"
			onChange={ value => {
				handleSettingsChange( { stackable_block_wide_width: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'The width used when a Columns block has its Content Width set to wide. This is automatically detected from your theme. You can adjust it if your blocks are not aligned correctly. In px, you can also use other units or use a calc() formula.', i18n ) }
		/>

		<h2>{ __( 'Editor', i18n ) }</h2>
		<p className="s-settings-subtitle">{ __( 'You can customize some of the features and behavior of Stackable in the editor here.' ) }	</p>
		<AdminToggleSetting
			label={ __( 'Design Library', i18n ) }
			value={ settings.stackable_enable_design_library }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_design_library: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Adds a button on the top of the editor which gives access to a collection of pre-made block designs.', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Block Linking (Beta)', i18n ) }
			value={ settings.stackable_enable_block_linking }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_block_linking: value } ) // eslint-disable-line camelcase
			} }
			help={
				<>
					{ __( 'Gives you the ability to link columns. Any changes you make on one column will automatically get applied on the other columns.', i18n ) }
					&nbsp;
					<a target="_docs" href="https://docs.wpstackable.com/article/452-how-to-use-block-linking">{ __( 'Learn more', i18n ) }</a>
				</>
			}
		/>

		<h2>{ __( 'Toolbar', i18n ) }</h2>
		<p className="s-settings-subtitle">{ __( 'You can disable some toolbar features here.', i18n ) }	</p>
		<AdminToggleSetting
			label={ __( 'Toolbar Text Highlight', i18n ) }
			value={ settings.stackable_enable_text_highlight }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_text_highlight: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Adds a toolbar button for highlighting text', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Toolbar Dynamic Content', i18n ) }
			value={ settings.stackable_enable_dynamic_content }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_dynamic_content: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Adds a toolbar button for inserting dynamic content', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Copy & Paste Styles', i18n ) }
			value={ settings.stackable_enable_copy_paste_styles }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_copy_paste_styles: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Adds a toolbar button for copying and pasting block styles', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Reset Layout', i18n ) }
			value={ settings.stackable_enable_reset_layout }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_reset_layout: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Adds a toolbar button for resetting the layout of a stackble block back to the original', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Save as Default Block', i18n ) }
			value={ settings.stackable_enable_save_as_default_block }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_save_as_default_block: value } ) // eslint-disable-line
			} }
			help={ __( 'Adds a toolbar button for saving a block as the default block', i18n ) }
		/>

		<h2>{ __( 'Inspector', i18n ) }</h2>
		<p className="s-settings-subtitle">{ __( 'You can customize some of the features and behavior of Stackable in the inspector here.' ) }</p>
		<AdminToggleSetting
			label={ __( 'Auto-Collapse Panels', i18n ) }
			value={ settings.stackable_auto_collapse_panels }
			onChange={ value => {
				handleSettingsChange( { stackable_auto_collapse_panels: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Collapse other inspector panels when opening another, keeping only one open at a time.', i18n ) }
		/>
	</>
}

const Responsiveness = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( 'Dynamic Breakpoints', i18n ) }</h2>
		<p className="s-settings-subtitle">
			{ __( 'Blocks can be styles differently for tablet and mobile screens, and some styles adjust to make them fit better in smaller screens. You can change the widths when tablet and mobile views are triggered. ', i18n ) }
			<a href="https://docs.wpstackable.com/article/464-how-to-use-dynamic-breakpoints?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">
				{ __( 'Learn more', i18n ) }
			</a>
		</p>
		<AdminTextSetting
			label={ __( 'Tablet Breakpoint', i18n ) }
			type="number"
			value={ settings.stackable_dynamic_breakpoints.tablet || '' } // eslint-disable-line camelcase
			onChange={ value => {
				handleSettingsChange( {
					stackable_dynamic_breakpoints: { // eslint-disable-line camelcase
						tablet: value,
						mobile: settings.stackable_dynamic_breakpoints.mobile || '', // eslint-disable-line camelcase
					},
				} )
			} }
			placeholder="1024"
		> px</AdminTextSetting>
		<AdminTextSetting
			label={ __( 'Mobile Breakpoint', i18n ) }
			type="number"
			value={ settings.stackable_dynamic_breakpoints.mobile || '' } // eslint-disable-line camelcase
			onChange={ value => {
				handleSettingsChange( {
					stackable_dynamic_breakpoints: { // eslint-disable-line camelcase
						tablet: settings.stackable_dynamic_breakpoints.tablet || '', // eslint-disable-line camelcase
						mobile: value,
					},
				} )
			} }
			placeholder="768"
		> px</AdminTextSetting>
	</>
}

// Toggle the block states between enabled, disabled and hidden.
// Enabled blocks are not stored in the settings object.
const Blocks = ( { settings, handleSettingsChange } ) => {
	const DERIVED_BLOCKS = getAllBlocks()
	const disabledBlocks = settings.stackable_disabled_blocks ?? {} // eslint-disable-line camelcase

	// TODO: Implement enable, disable and hide all blocks

	// const enableAllBlocks = type => () => {
	// 	let newDisabledBlocks = { ...disabledBlocks }
	// 	DERIVED_BLOCKS[ type ].forEach( block => {
	// 		newDisabledBlocks = newDisabledBlocks.filter( blockName => blockName !== block.name )
	// 	} )

	// 	console.log(DERIVED_BLOCKS[ type ] )

	// 	Object.entries(disabledBlocks).forEach( ([key, value]) => {
	// 		if (key in DERIVED_BLOCKS[ type ]) {
	// 			delete disabledBlocks[key]
	// 		}
	// 	} )

	// 	setDisabledBlocks( disabledBlocks )
	// 	save( newDisabledBlocks, type )
	// }

	// const disableAllBlocks = type => () => {
	// 	const newDisabledBlocks = [ ...disabledBlocks ]
	// 	DERIVED_BLOCKS[ type ].forEach( block => {
	// 		if ( ! newDisabledBlocks.includes( block.name ) ) {
	// 			newDisabledBlocks.push( block.name )
	// 		}
	// 	} )
	// 	setDisabledBlocks( newDisabledBlocks )
	// 	save( newDisabledBlocks, type )
	// }

	const toggleBlock = ( name, type, value ) => {
		const valueInt = Number( value )
		let newDisabledBlocks = { ...disabledBlocks }

		if ( valueInt === BLOCK_STATE.ENABLED ) {
			delete newDisabledBlocks[ name ]
		} else {
			newDisabledBlocks = { ...disabledBlocks, [ name ]: valueInt }
		}
		handleSettingsChange( { stackable_disabled_blocks: newDisabledBlocks } ) // eslint-disable-line camelcase
	}
	return (
		<>
			<h2>{ __( 'Blocks', i18n ) }</h2>
			<p className="s-settings-subtitle">{ __( 'You can enable, hide and disable Stackable blocks. Hiding the blocks hides them from the editor. Disabling the blocks prevent them from being loaded for faster performance.', i18n ) }</p>
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
							{ /*
							<button onClick={ enableAllBlocks( id ) } className="button button-large button-link">{ __( 'Enable All', i18n ) }</button>
							<button onClick={ disableAllBlocks( id ) } className="button button-large button-link">{ __( 'Disable All', i18n ) }</button>
							*/ }
						</div>
						<div className="s-settings-grid">
							{ DERIVED_BLOCKS[ id ].map( ( block, i ) => {
								const blockState = disabledBlocks[ block.name ] ?? BLOCK_STATE.ENABLED
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
									<>
										{ title }
										<AdvancedToolbarControl
											key={ i }
											value={ blockState }
											isToggleOnly={ true }
											default={ BLOCK_STATE.ENABLED }
											controls={ [
												{
													value: BLOCK_STATE.ENABLED,
													title: __( 'Enabled', i18n ),
												},
												{
													value: BLOCK_STATE.HIDDEN,
													title: __( 'Hidden', i18n ),
												},
												{
													value: BLOCK_STATE.DISABLED,
													title: __( 'Disabled', i18n ),
												},
											] }
											onChange={ value => {
												toggleBlock( block.name, id, value )
											} }
											isSmall={ true }
										/>
									</>
								)
							} ) }
						</div>
					</div>
				)
			} ) }
		</>
	)
}

const Optimizations = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( 'Optimizations', i18n ) }</h2>
		<AdminToggleSetting
			label={ __( 'Optimize Inline CSS', i18n ) }
			value={ settings.stackable_optimize_inline_css }
			onChange={ value => {
				handleSettingsChange( { stackable_optimize_inline_css: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Optimize inlined CSS styles. If this is enabled, similar selectors will be combined together, helpful if you changed Block Defaults.', i18n ) }
		/>
		<AdminToggleSetting
			label={ __( 'Lazy Load Images within Carousels', i18n ) }
			value={ settings.stackable_enable_carousel_lazy_loading }
			onChange={ value => {
				handleSettingsChange( { stackable_enable_carousel_lazy_loading: value } ) // eslint-disable-line camelcase
			} }
			help={ __( 'Disable this if you encounter layout or spacing issues when using images inside carousel-type blocks because of image lazy loading.', i18n ) }
		/>
	</>
}

const GlobalSettings = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( 'Global Settings', i18n ) }</h2>
		<AdminToggleSetting
			label={ __( 'Force Typography Styles', i18n ) }
			value={ settings.stackable_global_force_typography }
			onChange={ value => {
				handleSettingsChange( { stackable_global_force_typography: value } ) // eslint-disable-line camelcase
			} }
			disabled={ __( 'Not forced', i18n ) }
			enabled={ __( 'Force styles', i18n ) }
		/>
	</>
}

const EditorModeSettings = lazy( () => import( '../../pro__premium_only/src/welcome/editor-mode' ) )

const RoleManager = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( '📰 Role Manager', i18n ) }</h2>
		<p className="s-settings-subtitle">
			{ __( 'Lock the Block Editor\'s inspector for different user roles, and give clients edit access to only images and content. Content Editing Mode affects all blocks. ', i18n ) }
			<a
				target="_docs"
				href={ ! isPro
					? 'https://wpstackable.com/blog/introducing-role-manager-for-gutenberg/?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard'
					: 'https://docs.wpstackable.com/article/360-role-manager-and-content-editing-mode?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard'
				}
			>
				{ __( 'Learn more', i18n ) }
			</a>
		</p>
		{ isPro
			? <Suspense fallback={ <Spinner /> }>
				<div className="s-editing-mode-settings">
					<EditorModeSettings { ...{ settings, handleSettingsChange } } />
				</div>
			</Suspense>
			: <p className="s-settings-pro">
				{ __( 'This is only available in Stackable Premium. ', i18n ) }
				<a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium">
					{ __( 'Go Premium', i18n ) }
				</a>
			</p>
		}
	</>
}

const CustomFieldsEnableSettings = lazy( () => import( '../../pro__premium_only/src/welcome/custom-fields-toggle' ) )
const CustomFieldsManagerSettings = lazy( () => import( '../../pro__premium_only/src/welcome/custom-fields-roles' ) )

const CustomFields = ( { settings, handleSettingsChange } ) => {
	return <>
		<div className="s-custom-fields-settings-header">
			<h2>{ __( '📋 Custom Fields', i18n ) }</h2>
			{ isPro &&
				<Suspense fallback={ <Spinner /> }>
					<div className="s-custom-fields-enable">
						<CustomFieldsEnableSettings { ...{ settings, handleSettingsChange } } />
					</div>
				</Suspense>
			}
		</div>
		<p className="s-settings-subtitle">
			{ __( 'Create Custom Fields that you can reference across your entire site. You can assign which roles can manage your Custom Fields. ', i18n ) }
			<a href="https://docs.wpstackable.com/article/463-how-to-use-stackable-custom-fields/?utm_source=wp-settings-custom-fields&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">
				{ __( 'Learn more', i18n ) }
			</a>
		</p>
		{ isPro
			? <Suspense fallback={ <Spinner /> }>
				<div className="s-custom-fields-manager">
					<CustomFieldsManagerSettings { ...{ settings, handleSettingsChange } } />
				</div>
			</Suspense>
			: <p className="s-settings-pro">
				{ __( 'This is only available in Stackable Premium. ', i18n ) }
				<a href="https://wpstackable.com/premium/?utm_source=wp-settings-custom-fields&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium">
					{ __( 'Go Premium', i18n ) }
				</a>
			</p>
		}
	</>
}

const Integrations = ( { settings, handleSettingsChange } ) => {
	return <>
		<h2>{ __( 'Integrations', i18n ) }</h2>
		<AdminTextSetting
			label={ __( 'Google Maps API Key', i18n ) }
			value={ settings.stackable_google_maps_api_key }
			type="text"
			onChange={ value => {
				handleSettingsChange( { stackable_google_maps_api_key: value } ) // eslint-disable-line camelcase
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
				value={ settings.stackable_icons_fa_free_version }
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
				onChange={ value => {
					handleSettingsChange( { stackable_icons_fa_free_version: value } ) // eslint-disable-line camelcase
				} }
			/>
		</div>
	</>
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
			<h2>{ __( '🔩 Other Settings', i18n ) }</h2>
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
	if ( document.querySelector( '.s-getting-started__body' ) ) {
		createRoot(
			document.querySelector( '.s-getting-started__body' )
		).render(
			<GettingStarted />
		)
	}

	// This is for the getting started block list.
	if ( document.querySelector( '.s-getting-started__block-list' ) ) {
		createRoot(
			document.querySelector( '.s-getting-started__block-list' )
		).render(
			<BlockList />
		)
	}

	if ( document.querySelector( '.s-sidenav' ) ) {
		createRoot(
			document.querySelector( '.s-sidenav' )
		).render(
			<Sidenav />
		)
	}

	if ( document.querySelector( '.s-rest-settings-notice' ) ) {
		createRoot(
			document.querySelector( '.s-rest-settings-notice' )
		).render(
			<RestSettingsNotice />
		)
	}

	if ( document.querySelector( '.s-content' ) ) {
		createRoot(
			document.querySelector( '.s-content' )
		).render(
			<Settings />
		)
	}
} )
