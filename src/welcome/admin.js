/**
 * Internal dependencies
 */
import './news'
import blockData from './blocks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Component, render, useEffect, useState, Fragment,
} from '@wordpress/element'
import { send as ajaxSend } from '@wordpress/ajax'
import domReady from '@wordpress/dom-ready'
import { Spinner, CheckboxControl } from '@wordpress/components'
import { loadPromise, models } from '@wordpress/api'

/**
 * External dependencies
 */
import {
	disabledBlocks,
	i18n,
	nonce,
	showProNoticesOption,
	welcomeSrcUrl,
} from 'stackable'
import classnames from 'classnames'
import { AdminToggleSetting, AdminTextSetting } from '~stackable/components'

class BlockToggler extends Component {
	constructor() {
		super( ...arguments )
		this.toggleBlock = this.toggleBlock.bind( this )
		this.enableAllBlocks = this.enableAllBlocks.bind( this )
		this.disableAllBlocks = this.disableAllBlocks.bind( this )
		this.ajaxTimeout = null
		this.state = {
			disabledBlocks: this.props.disabledBlocks || [],
			isSaving: false,
		}
	}

	// Send our changes.
	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.disabledBlocks === prevState.disabledBlocks ) {
			return
		}

		clearTimeout( this.ajaxTimeout )
		this.ajaxTimeout = setTimeout( () => {
			ajaxSend( 'stackable_update_disable_blocks', {
				success: () => {
					this.setState( { isSaving: false } )
				},
				error: message => {
					this.setState( { isSaving: false } )
					alert( message ) // eslint-disable-line no-alert
				},
				data: {
					nonce,
					disabledBlocks: this.state.disabledBlocks,
				},
			} )
			this.setState( { isSaving: true } )
		}, 600 )
	}

	toggleBlock( blockName ) {
		if ( this.state.disabledBlocks.includes( blockName ) ) {
			this.setState( { disabledBlocks: this.state.disabledBlocks.filter( value => value !== blockName ) } )
		} else {
			this.setState( { disabledBlocks: [ ...this.state.disabledBlocks, blockName ] } )
		}
	}

	enableAllBlocks() {
		this.setState( { disabledBlocks: [] } )
	}

	disableAllBlocks() {
		this.setState( { disabledBlocks: Object.keys( this.props.blocks ) } )
	}

	render() {
		const { blocks: blockData } = this.props

		return (
			<div>
				<div className="s-settings-header">
					{ this.state.isSaving && <Spinner /> }
					<button onClick={ this.enableAllBlocks } className="button button-large button-link">{ __( 'Enable All', i18n ) }</button>
					<button onClick={ this.disableAllBlocks } className="button button-large button-link">{ __( 'Disable All', i18n ) }</button>
				</div>
				<div className="s-settings-grid">
					{ Object.keys( blockData ).map( ( blockName, i ) => {
						const block = blockData[ blockName ]

						// Don't show blocks that we really hide due to deprecation.
						if ( block.sDeprecated ) {
							return null
						}

						const isDisabled = this.state.disabledBlocks.includes( blockName )
						const mainClasses = classnames( [
							's-box',
							's-box-small',
						], {
							's-is-disabled': isDisabled,
						} )

						const blockNameTrim = blockName.replace( /\w+\//, '' )
						return (
							<div key={ i + 1 } className={ mainClasses }>
								<img src={ `${ welcomeSrcUrl }/images/block-${ blockNameTrim }.svg` } alt={ `${ block.title } icon` } className="s-block-icon" />
								<h4>{ block.title }</h4>
								<p className="s-block-description">{ block.description }</p>
								{ block.sDemoURL && (
									<p className="s-demo-url"><small><a href={ block.sDemoURL } target="stackable_demo" title={ sprintf( __( 'View %s Demo', i18n ), block.title ) } >{ __( 'View Block Demo', i18n ) }</a></small></p>
								) }
								<button
									className="s-toggle-button"
									onClick={ () => this.toggleBlock( blockName ) }
								>
									<span>{ __( 'Disabled', i18n ) }</span>
									<span>{ __( 'Enabled', i18n ) }</span>
								</button>
							</div>
						)
					} ) }
				</div>
			</div>
		)
	}
}

const EditorSettings = () => {
	const [ disableDesignLibrary, setDisableDesignLibrary ] = useState( false )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setDisableDesignLibrary( !! response.stackable_disable_design_library )
			} )
		} )
	}, [] )

	return <>
		<AdminToggleSetting
			label={ __( 'Design Library', i18n ) }
			value={ disableDesignLibrary }
			onChange={ value => {
				const model = new models.Settings( { stackable_disable_design_library: value } ) // eslint-disable-line camelcase
				model.save()
				setDisableDesignLibrary( value )
			} }
			disabled={ __( 'Hide Design Library Button', i18n ) }
			enabled={ __( 'Show Design Library Button', i18n ) }
		/>
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
	const [ v2EditorBackwardCompatibility, setV2EditorackwardCompatibility ] = useState( false )
	const [ v2EditorBackwardCompatibilityUsage, setV2EditorackwardCompatibilityUsage ] = useState( false )
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
				setV2EditorackwardCompatibility( response.stackable_v2_editor_compatibility === '1' )
				setV2EditorackwardCompatibilityUsage( response.stackable_v2_editor_compatibility_usage === '1' )
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
						setV2EditorackwardCompatibilityUsage( false )
					}
					updateSetting( settings )
					setV2EditorackwardCompatibility( checked )
				} }
			/>
			<CheckboxControl
				label={ __( 'Load version 2 blocks in the editor only when the page was using version 2 blocks', i18n ) }
				checked={ v2EditorBackwardCompatibilityUsage }
				onChange={ checked => {
					const settings = { stackable_v2_editor_compatibility_usage: checked ? '1' : '' } // eslint-disable-line camelcase
					if ( checked ) {
						settings.stackable_v2_editor_compatibility = '' // eslint-disable-line camelcase
						setV2EditorackwardCompatibility( false )
					}
					updateSetting( settings )
					setV2EditorackwardCompatibilityUsage( checked )
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

// TODO: move to deprecated v2
const OptimizationSettings = () => {
	const [ optimizeScriptLoad, setOptimizeScriptLoad ] = useState( false )

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setOptimizeScriptLoad( !! response.stackable_optimize_script_load )
			} )
		} )
	}, [] )

	const updateOptimizeScriptLoad = value => {
		const model = new models.Settings( { stackable_optimize_script_load: value } ) // eslint-disable-line camelcase
		model.save()
		setOptimizeScriptLoad( value )
	}

	return <Fragment>
		<AdminToggleSetting
			label={ __( 'Frontend JS & CSS Files', i18n ) }
			value={ optimizeScriptLoad }
			onChange={ updateOptimizeScriptLoad }
			disabled={ __( 'Load across entire site', i18n ) }
			enabled={ __( 'Load only in posts with Stackable blocks', i18n ) }
		/>
	</Fragment>
}

// Load all the options into the UI.
domReady( () => {
	render(
		<BlockToggler blocks={ blockData } disabledBlocks={ disabledBlocks } />,
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

	// TODO: move to deprecated v2
	if ( document.querySelector( '.s-optimization-settings' ) ) {
		render(
			<OptimizationSettings />,
			document.querySelector( '.s-optimization-settings' )
		)
	}
} )
