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
	Component, render, useEffect, useState,
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
						], {
							's-is-disabled': isDisabled,
						} )

						const blockNameTrim = blockName.replace( /\w+\//, '' )
						return (
							<div key={ i + 1 } className={ mainClasses }>
								<img src={ `${ welcomeSrcUrl }/images/block-${ blockNameTrim }.svg` } alt={ `${ block.title } icon` } className="s-block-icon" />
								<h3>{ block.title }</h3>
								<p>{ block.description }</p>
								<button
									className="s-toggle-button"
									onClick={ () => this.toggleBlock( blockName ) }
								>
									<span>{ __( 'Disabled', i18n ) }</span>
									<span>{ __( 'Enabled', i18n ) }</span>
								</button>
								{ block.sDemoURL && (
									<p className="s-demo-url"><small><a href={ block.sDemoURL } target="stackable_demo" title={ sprintf( __( 'View %s Demo', i18n ), block.title ) } >{ __( 'View Block Demo', i18n ) }</a></small></p>
								) }
							</div>
						)
					} ) }
				</div>
			</div>
		)
	}
}

const AdditionalOptions = props => {
	const [ helpTooltipsDisabled, setHelpTooltipsDisabled ] = useState( false )
	const [ v1BackwardCompatibility, setV1BackwardCompatibility ] = useState( false )
	const [ showPremiumNotices, setShowPremiumNotices ] = useState( false )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		setIsBusy( true )
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setHelpTooltipsDisabled( !! response.stackable_help_tooltip_disabled )
				setV1BackwardCompatibility( response.stackable_load_v1_styles === '1' )
				setShowPremiumNotices( response.stackable_show_pro_notices === '1' )
			} )
		} )
	}, [] )

	const updateSetting = ( setting, value ) => {
		setIsBusy( true )
		const model = new models.Settings( { [ setting ]: value } )
		model.save().then( () => setIsBusy( false ) )
	}

	return (
		<div>
			<h4>{ __( 'Additional Options', i18n ) }</h4>
			{ props.showProNoticesOption &&
				<CheckboxControl
					label={ __( 'Show "Go premium" notices', i18n ) }
					checked={ showPremiumNotices }
					onChange={ checked => {
						updateSetting( 'stackable_show_pro_notices', checked ? '1' : '' )
						setShowPremiumNotices( checked )
					} }
				/>
			}
			<CheckboxControl
				label={ __( 'Load version 1 block stylesheet for backward compatibility', i18n ) }
				checked={ v1BackwardCompatibility }
				onChange={ checked => {
					updateSetting( 'stackable_load_v1_styles', checked ? '1' : '' )
					setV1BackwardCompatibility( checked )
				} }
			/>
			<CheckboxControl
				label={ __( 'Don\'t show help video tooltips', i18n ) }
				checked={ helpTooltipsDisabled }
				onChange={ checked => {
					updateSetting( 'stackable_help_tooltip_disabled', checked ? '1' : '' )
					setHelpTooltipsDisabled( checked )
				} }
			/>
			<div className="ugb--saving-wrapper">
				{ isBusy && <Spinner /> }
			</div>
		</div>
	)
}

AdditionalOptions.defaultProps = {
	showProNoticesOption: false,
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
} )
