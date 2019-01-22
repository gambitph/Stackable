import { __, sprintf } from '@wordpress/i18n'
import { Component, render } from '@wordpress/element'
import { disabledBlocks, nonce, srcUrl } from 'stackable'
import { send as ajaxSend } from '@wordpress/ajax'
import classnames from 'classnames'
import domReady from '@wordpress/dom-ready'
import { Spinner } from '@wordpress/components'

// Gather all the blocks.
const context = require.context(
	'../block', // Search within the src/blocks directory.
	true, // Search recursively.
	/index\.js$/ // Match any index.js.
)

const blockData = {}

// Import all the blocks and get all the settings.
context.keys().forEach( key => {
	try {
		const block = context( key )
		blockData[ block.name ] = block.settings
	} catch ( err ) {
		console.error( err ) // eslint-disable-line no-console
	}
} )

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
		// console.log(this.state === prevState);
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
					nonce: nonce,
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
					<button onClick={ this.enableAllBlocks } className="button button-large button-link">{ __( 'Enable All' ) }</button>
					<button onClick={ this.disableAllBlocks } className="button button-large button-link">{ __( 'Disable All' ) }</button>
				</div>
				<div className="s-settings-grid">
					{ Object.keys( blockData ).map( ( blockName, i ) => {
						const block = blockData[ blockName ]
						const blockNameTrim = blockName.replace( /\w+\//, '' )
						const title = block.sAdminTitle || block.title

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

						return (
							<div key={ i + 1 } className={ mainClasses }>
								<img src={ `${ srcUrl }images/block-${ blockNameTrim }.svg` } alt={ `${ title } icon` } />
								<h3>{ title }</h3>
								<p>{ block.description }</p>
								<button
									className="s-toggle-button"
									onClick={ () => this.toggleBlock( blockName ) }
								>
									<span>{ __( 'Disabled' ) }</span>
									<span>{ __( 'Enabled' ) }</span>
								</button>
								{ block.sDemoURL && (
									<p className="s-demo-url"><small><a href={ block.sDemoURL } target="stackable_demo" title={ sprintf( __( 'View %s Demo', 'stackable' ), title ) } >{ __( 'View Block Demo', 'stackable' ) }</a></small></p>
								) }
							</div>
						)
					} ) }
				</div>
			</div>
		)
	}
}

// Load all the blocks into the UI.
domReady( () => {
	render(
		<BlockToggler blocks={ blockData } disabledBlocks={ disabledBlocks } />,
		document.querySelector( '.s-settings-wrapper' )
	)
} )
