/**
 * Internal dependencies
 */
import './news'
import blockData from './blocks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { Component, render } from '@wordpress/element'
import { send as ajaxSend } from '@wordpress/ajax'
import domReady from '@wordpress/dom-ready'
import { Spinner } from '@wordpress/components'

/**
 * External dependencies
 */
import {
	disabledBlocks,
	i18n,
	nonce,
	nonceProNotice,
	showProNoticesOption,
	welcomeSrcUrl,
	loadV1Styles,
	nonceLoadV1Styles,
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

class ProNoticeToggler extends Component {
	constructor() {
		super( ...arguments )
		this.toggle = this.toggle.bind( this )
		this.ajaxTimeout = null
		this.state = {
			checked: this.props.checked,
			isSaving: false,
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.checked === prevState.checked ) {
			return
		}

		clearTimeout( this.ajaxTimeout )
		this.ajaxTimeout = setTimeout( () => {
			ajaxSend( 'stackable_update_show_pro_notice_option', {
				success: () => {
					this.setState( { isSaving: false } )
				},
				error: message => {
					this.setState( { isSaving: false } )
					alert( message ) // eslint-disable-line no-alert
				},
				data: {
					nonce: nonceProNotice,
					checked: this.state.checked,
				},
			} )
			this.setState( { isSaving: true } )
		}, 600 )
	}

	toggle() {
		this.setState( { checked: ! this.state.checked } )
	}

	render() {
		return (
			<label className="s-input-checkbox" htmlFor="s-input-go-premium">
				<input
					type="checkbox"
					id="s-input-go-premium"
					checked={ this.state.checked }
					onChange={ this.toggle }
				/>
				{ __( 'Show "Go premium" notices', i18n ) }
				{ this.state.isSaving && <Spinner /> }
			</label>
		)
	}
}

class BackwardCompatibilityToggler extends Component {
	constructor() {
		super( ...arguments )
		this.toggle = this.toggle.bind( this )
		this.ajaxTimeout = null
		this.state = {
			checked: this.props.checked,
			isSaving: false,
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.checked === prevState.checked ) {
			return
		}

		clearTimeout( this.ajaxTimeout )
		this.ajaxTimeout = setTimeout( () => {
			ajaxSend( 'stackable_update_load_v1_styles_option', {
				success: () => {
					this.setState( { isSaving: false } )
				},
				error: message => {
					this.setState( { isSaving: false } )
					alert( message ) // eslint-disable-line no-alert
				},
				data: {
					nonce: nonceLoadV1Styles,
					checked: this.state.checked,
				},
			} )
			this.setState( { isSaving: true } )
		}, 600 )
	}

	toggle() {
		this.setState( { checked: ! this.state.checked } )
	}

	render() {
		return (
			<label className="s-input-checkbox" htmlFor="s-input-v1-backward-compat">
				<input
					type="checkbox"
					id="s-input-v1-backward-compat"
					checked={ this.state.checked }
					onChange={ this.toggle }
				/>
				{ __( 'Load version 1 block stylesheet for backward compatibility', i18n ) }
				{ this.state.isSaving && <Spinner /> }
			</label>
		)
	}
}

// Load all the options into the UI.
domReady( () => {
	render(
		<BlockToggler blocks={ blockData } disabledBlocks={ disabledBlocks } />,
		document.querySelector( '.s-settings-wrapper' )
	)

	if ( document.querySelector( '.s-pro-control-wrapper' ) ) {
		render(
			<ProNoticeToggler checked={ showProNoticesOption } />,
			document.querySelector( '.s-pro-control-wrapper' )
		)
	}

	render(
		<BackwardCompatibilityToggler checked={ loadV1Styles } />,
		document.querySelector( '.s-backward-compatibility-control-wrapper' )
	)
} )
