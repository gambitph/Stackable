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
	contactURL,
	disabledBlocks,
	i18n,
	isPro,
	nonce,
	nonceProNotice,
	pricingURL,
	showProNoticesOption,
	welcomeSrcUrl,
	loadV1Styles,
	nonceLoadV1Styles,
} from 'stackable'
import {
	Tab, TabList, TabPanel, Tabs,
} from 'react-tabs'
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

const knowledgeBaseList = () => {
	return (
		<ul className="s-tabs-list">
			<li>
				<span role="img" aria-label="book">📖</span> <a href="https://wpstackable.com/documentation?utm_medium=Welcome%20Page&utm_campaign=Welcome%20Help&utm_source=Plugin" target="_blank" rel="noopener noreferrer"><strong>{ __( 'Documentation', i18n ) }</strong></a>
				<br />
				<span>{ __( 'Documentation & tutorials for building your site with Stackable.', i18n ) }</span>
			</li>
			{ isPro &&
				<li>
					<span role="img" aria-label="envelope">✉️</span> <a href={ contactURL }><strong>{ __( 'Contact Email Support', i18n ) }</strong></a>
					<br />
					<span>{ __( 'Stuck with something? Email us and we’ll help you out.', i18n ) }</span>
				</li>
			}
			<li>
				<span role="img" aria-label="discuss">💬</span> <a href="https://facebook.com/groups/wpstackable" target="_blank" rel="noopener noreferrer"><strong>{ __( 'Facebook Community Group', i18n ) }</strong></a>
				<br />
				<span>{ __( 'Connect with other people using Stackable and join the discussion.', i18n ) }</span>
			</li>
			<li>
				<span role="img" aria-label="code">💻</span> <a href="https://github.com/gambitph/Stackable/issues" target="_blank" rel="noopener noreferrer"><strong>{ __( 'GitHub', i18n ) }</strong></a>
				<br />
				<span>{ __( 'Discuss technical plugin issues and contribute to the plugin code.', i18n ) }</span>
			</li>
			<li>
				<span role="img" aria-label="support">🤝</span> <a href="https://wordpress.org/support/plugin/stackable-ultimate-gutenberg-blocks/" taregt="_blank" rel="noopener noreferrer"><strong>{ __( 'WordPress Plugin Support Forum', i18n ) }</strong></a>
				<br />
				<span>{ __( 'Community-powered plugin support forum', i18n ) }</span>
			</li>
		</ul>
	)
}

class HelpTabs extends Component {
	render() {
		// If already pro, no need to show the tabs.
		if ( isPro ) {
			return (
				<div>
					<div className="s-video-tutorial-wrapper">
						<iframe
							title={ __( 'Video Tutorial', i18n ) }
							width="560"
							height="315"
							src="https://www.youtube.com/embed/OR6wNum6mUg"
							frameBorder="0"
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
					<h3>{ __( 'Knowledge Base', i18n ) }</h3>
					{ knowledgeBaseList() }
				</div>
			)
		}

		return (
			<Tabs>
				<TabList className="s-tabs">
					<Tab>{ __( 'Video Tutorial', i18n ) }</Tab>
					<Tab>{ __( 'Knowledge Base', i18n ) }</Tab>
					<Tab>{ __( 'Get Support', i18n ) }</Tab>
				</TabList>
				<TabPanel>
					<div className="s-video-tutorial-wrapper">
						<iframe
							title={ __( 'Video Tutorial', i18n ) }
							width="560"
							height="315"
							src="https://www.youtube.com/embed/OR6wNum6mUg"
							frameBorder="0"
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
					<p><strong>{ __( 'Need help?', i18n ) }</strong></p>
					<p>{ __( 'Upgrade to Premium and our support team will be there to answer any questions you might have about the usage of Stackable.', i18n ) }</p>
					<p className="s-link-pair">
						<a href={ pricingURL } title={ __( 'Get Stackable Premium', i18n ) }>{ __( 'Get Stackable Premium', i18n ) + ' →' }</a>
						<a href="https://rebrand.ly/plugin-welcome-learn-premium-support" title={ __( 'Learn More', i18n ) } target="_blank" rel="noopener noreferrer">{ __( 'Learn More', i18n ) + ' →' }</a>
					</p>
				</TabPanel>
				<TabPanel>
					{ knowledgeBaseList() }
					<p><strong>{ __( 'Need help?', i18n ) }</strong></p>
					<p>{ __( 'Upgrade to Premium and our support team will be there to answer any questions you might have about the usage of Stackable.', i18n ) }</p>
					<p className="s-link-pair">
						<a href={ pricingURL } title={ __( 'Get Stackable Premium', i18n ) }>{ __( 'Get Stackable Premium', i18n ) + ' →' }</a>
						<a href="https://rebrand.ly/plugin-welcome-learn-premium-support" title={ __( 'Learn More', i18n ) } target="_blank" rel="noopener noreferrer">{ __( 'Learn More', i18n ) + ' →' }</a>
					</p>
				</TabPanel>
				<TabPanel>
					<h3>{ __( 'Email support is a Stackable Premium feature', i18n ) }</h3>
					<p>{ __( 'Upgrade to Premium and our support team will be there to answer any questions you might have about the usage of Stackable.', i18n ) }</p>
					<p>{ __( 'Here are the other features you\'ll by going Premium:', i18n ) }</p>
					<ul className="s-check-list">
						<li>{ __( '50+ Premium Layouts', i18n ) }</li>
						<li>{ __( 'Seamless Layout Switching', i18n ) }</li>
						<li>{ __( 'All Premium Effects', i18n ) }</li>
						<li>{ __( '3-Layer Separators', i18n ) }</li>
						<li>{ __( 'Custom CSS', i18n ) }</li>
						<li>{ __( 'No Ads', i18n ) }</li>
						<li>{ __( 'Lifetime Use', i18n ) }</li>
						<li>{ __( '1 Year of Updates & Support', i18n ) }</li>
					</ul>
					<p className="s-link-pair">
						<a href={ pricingURL } title={ __( 'Get Stackable Premium', i18n ) }>{ __( 'Get Stackable Premium', i18n ) + ' →' }</a>
						<a href="https://rebrand.ly/plugin-welcome-learn-premium-support" title={ __( 'Learn More', i18n ) } target="_blank" rel="noopener noreferrer">{ __( 'Learn More', i18n ) + ' →' }</a>
					</p>
				</TabPanel>
			</Tabs>
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

	render( <HelpTabs />, document.querySelector( '#s-help-area' ) )
} )
