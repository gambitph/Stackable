/**
 * External dependencies
 */
import { i18n, pricingURL } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { Modal } from '@wordpress/components'

class ProModalPricing extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isOpen: this.props.isOpen || false,
		}
		this.close = this.close.bind( this )
	}

	close() {
		this.setState( { isOpen: false } )
	}

	render() {
		if ( ! this.state.isOpen ) {
			return null
		}

		return (
			<Modal
				className="ugb-pro-modal ugb-pro-modal-pricing"
				onRequestClose={ this.close }
				shouldCloseOnEsc={ false }
				shouldCloseOnClickOutside={ false }
			>
				<img src="https://gambitph.github.io/Stackable/assets/premium-slider/upgrade.jpg" alt={ __( 'Do more with Stackable Premium', i18n ) } />
				<div className="ugb-pro-modal__footer">
					<a href={ pricingURL }
						className="button button-secondary"
						target="_blank"
						rel="noopener noreferrer"
						title={ __( 'Go Premium', i18n ) }
					>
						{ __( 'Go Premium', i18n ) }
					</a>
					<a href="https://rebrand.ly/plugin-premium-demo"
						className="button button-secondary button-ghost"
						target="_blank"
						rel="noopener noreferrer"
						title={ __( 'Try Premium Demo', i18n ) }
					>
						{ __( 'Try Premium Demo', i18n ) }
					</a>
					<a href="https://rebrand.ly/plugin-slider-premium"
						target="_blank"
						rel="noopener noreferrer"
						title={ __( 'Visit Site', i18n ) }
					>
						{ __( 'Visit Site', i18n ) }
					</a>
				</div>
			</Modal>
		)
	}
}

export default ProModalPricing
