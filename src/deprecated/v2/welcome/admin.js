/**
 * Internal dependencies
 */
import blockData from './blocks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Component, createRoot, useEffect, useState, Fragment,
} from '@wordpress/element'
import { send as ajaxSend } from '@wordpress/ajax'
import domReady from '@wordpress/dom-ready'
import { Spinner } from '@wordpress/components'
import { loadPromise, models } from '@wordpress/api'

/**
 * External dependencies
 */
import {
	v2disabledBlocks as disabledBlocks,
	i18n,
	v2nonce as nonce,
} from 'stackable'
import AdminToggleSetting from '~stackable/components/admin-toggle-setting'

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
			ajaxSend( 'stackable_update_disable_blocks_v2', {
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
				<div className="s-settings-grid" style={ { rowGap: 0 } }>
					{ Object.keys( blockData ).map( ( blockName, i ) => {
						const block = blockData[ blockName ]

						// Don't show blocks that we really hide due to deprecation.
						if ( block.sDeprecated ) {
							return null
						}

						const isDisabled = this.state.disabledBlocks.includes( blockName )

						return (
							<AdminToggleSetting
								key={ i }
								label={ __( block.title, i18n ) } /* eslint-disable-line @wordpress/i18n-no-variables */
								value={ ! isDisabled }
								onChange={ () => this.toggleBlock( blockName ) }
								size="small"
								disabled={ __( 'Disabled', i18n ) }
								enabled={ __( 'Enabled', i18n ) }
							/>
						)
					} ) }
				</div>
			</div>
		)
	}
}

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
	if ( document.querySelector( '.s-settings-wrapper-v2' ) ) {
		createRoot( document.querySelector( '.s-settings-wrapper-v2' ) ).render(
			<BlockToggler blocks={ blockData } disabledBlocks={ disabledBlocks } />
		)
	}

	if ( document.querySelector( '.s-optimization-settings' ) ) {
		createRoot( document.querySelector( '.s-optimization-settings' ) ).render(
			<OptimizationSettings />
		)
	}
} )
