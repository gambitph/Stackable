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
import { pick, sortBy } from 'lodash'
import {
	render, useEffect, useState, Fragment, createRef, useCallback,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { Spinner, CheckboxControl } from '@wordpress/components'
import { loadPromise, models } from '@wordpress/api'

/**
 * External dependencies
 */
import {
	i18n,
	showProNoticesOption,
} from 'stackable'
import classnames from 'classnames'
import { AdminToggleSetting, AdminTextSetting } from '~stackable/components'

// Collect all the blocks and their variations for enabling/disabling and sort
// them by type.
const importBlocks = r => {
	const blocks = {}
	r.keys().forEach( key => {
		const meta = r( key )
		const type = meta[ 'stk-type' ]
		if ( type ) {
			if ( ! blocks[ type ] ) {
				blocks[ type ] = []
			}
			blocks[ type ].push( meta )
		}

		// Add any varations if any.
		( meta.variations || [] ).forEach( variation => {
			const type = variation[ 'stk-type' ]
			if ( type ) {
				if ( ! blocks[ type ] ) {
					blocks[ type ] = []
				}
				blocks[ type ].push( {
					...variation,
					name: `${ meta.name }|${ variation.name }`,
				} )
			}
		} )
	} )
	Object.keys( blocks ).forEach( type => {
		blocks[ type ] = sortBy( blocks[ type ], 'name' )
	} )
	return blocks
}

const BLOCKS = importBlocks( require.context( '../block', true, /block\.json$/ ) )
const BLOCK_CATEROGIES = [
	{
		id: 'essential',
		label: __( 'Essential Blocks', i18n ),
		icon: <SVGEssentialIcon height="20" width="20" />,
	},
	{
		id: 'special',
		label: __( 'Special Blocks', i18n ),
		icon: <SVGSpecialIcon height="20" width="20" />,
	},
	{
		id: 'section',
		label: __( 'Section Blocks', i18n ),
		icon: <SVGSectionIcon height="20" width="20" />,
	},
]

const BlockToggle = props => {
	const {
		onChange,
		value = '',
		label = '',
		demo = '',
		...propsToPass
	} = props
	const ref = createRef()

	return (
		<label // eslint-disable-line
			onClick={ ev => {
				onChange( value )
				ev.preventDefault()
				ref.current.focus()
			} }
			{ ...propsToPass }
		>
			<h4>{ label }</h4>
			{ demo && (
				<span className="s-block-demo">
					<a
						href={ demo }
						target="_blank"
						rel="noopener noreferrer"
						onClick={ ev => ev.stopPropagation() }
					>
						{ __( 'view demo', i18n ) }
					</a>
				</span>
			) }
			<button
				className="s-toggle-button"
				ref={ ref }
				data-value={ value }
				onClick={ ev => {
					onChange( value )
					ev.stopPropagation()
					ev.preventDefault()
				} }
			>
				<span>{ __( 'Disabled', i18n ) }</span>
				<span>{ __( 'Enabled', i18n ) }</span>
			</button>
		</label>
	)
}

BlockToggle.defaultProps = {
	label: '',
	value: '',
	onChange: () => {},
	demo: '',
}

const BlockToggler = () => {
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
		BLOCKS[ type ].forEach( block => {
			newDisabledBlocks = newDisabledBlocks.filter( blockName => blockName !== block.name )
		} )
		setDisabledBlocks( newDisabledBlocks )
		save( newDisabledBlocks, type )
	}

	const disableAllBlocks = type => () => {
		const newDisabledBlocks = [ ...disabledBlocks ]
		BLOCKS[ type ].forEach( block => {
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
				id, label, icon,
			} ) => {
				const classes = classnames( [
					's-box-block__title',
					`s-box-block__title--${ id }`,
				] )
				return (
					<div className="s-box s-box-block" key={ id }>
						<h3 className={ classes }>
							{ icon }
							<span>{ label }</span>
						</h3>
						<div className="s-settings-header">
							{ isSaving === id && <Spinner /> }
							<button onClick={ enableAllBlocks( id ) } className="button button-large button-link">{ __( 'Enable All', i18n ) }</button>
							<button onClick={ disableAllBlocks( id ) } className="button button-large button-link">{ __( 'Disable All', i18n ) }</button>
						</div>
						<div className="s-settings-grid">
							{ BLOCKS[ id ].map( ( block, i ) => {
								const isDisabled = disabledBlocks.includes( block.name )
								const mainClasses = classnames( [
									's-block',
								], {
									's-is-disabled': isDisabled,
								} )

								return (
									<BlockToggle
										key={ i + 1 }
										label={ block.title }
										value={ block.name }
										className={ mainClasses }
										demo={ block[ 'stk-demo' ] }
										onChange={ value => {
											toggleBlock( value, id )
										} }
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
				setSettings( pick( response, [ 'stackable_enable_design_library', 'stackable_block_max_width', 'stackable_auto_collapse_panels', 'stackable_enable_block_linking' ] ) )
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
			disabled={ __( 'Disable feature', i18n ) }
			enabled={ __( 'Enable feature', i18n ) }
		/>
		<AdminTextSetting
			label={ __( 'Block Max Width', i18n ) }
			value={ settings.stackable_block_max_width }
			type="number"
			onChange={ value => {
				clearTimeout( saveTimeout )
				setSettings( {
					...settings,
					stackable_block_max_width: value, // eslint-disable-line camelcase
				} )
				setSaveTimeout( setTimeout( () => {
					setIsBusy( true )
					const model = new models.Settings( { stackable_block_max_width: value } ) // eslint-disable-line camelcase
					model.save().then( () => setIsBusy( false ) )
				}, 400 ) )
			} }
			help={ __( 'The maximum width of Stackable blocks. Leave blank for the blocks to follow the content width of your theme.', i18n ) }
		> px</AdminTextSetting>
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
			disabled={ __( 'Disable feature', i18n ) }
			enabled={ __( 'Enable feature', i18n ) }
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
					<a target="_docs" href="https://docs.wpstackable.com/article/462-migrating-from-version-2-to-version-3?utm_source=wp-settings-migrating&utm_campaign=learnmore&utm_medium=wp-dashboard">{ __( 'Learn more', i18n ) }</a>
				</>
			}
			disabled={ __( 'Disable feature', i18n ) }
			enabled={ __( 'Enable feature', i18n ) }
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
	render(
		<BlockToggler />,
		document.querySelector( '.s-settings-wrapper' )
	)

	render(
		<AdditionalOptions
			showProNoticesOption={ showProNoticesOption }
		/>,
		document.querySelector( '.s-other-options-wrapper' )
	)

	render(
		<EditorSettings />,
		document.querySelector( '.s-editor-settings' )
	)

	render(
		<DynamicBreakpointsSettings />,
		document.querySelector( '.s-dynamic-breakpoints' )
	)

	render(
		<GlobalSettings />,
		document.querySelector( '.s-global-settings' )
	)
} )
