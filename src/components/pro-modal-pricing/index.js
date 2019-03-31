import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { Modal } from '@wordpress/components'
import { pricingURL } from 'stackable'

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
				<img src="https://gambitph.github.io/Stackable/assets/premium-slider/upgrade.jpg" alt={ __( 'Do more with Stackable Premium' ) } />
				<div className="ugb-pro-modal__footer">
					<a href={ pricingURL }
						className="button button-secondary"
						target="_blank"
						title={ __( 'Go Premium' ) }
					>
						{ __( 'Go Premium' ) }
					</a>
					<a href="https://rebrand.ly/plugin-premium-demo"
						className="button button-secondary button-ghost"
						target="_blank" // eslint-disable-line
						rel="noopener"
						title={ __( 'Try Premium Demo' ) }
					>
						{ __( 'Try Premium Demo' ) }
					</a>
					<a href="https://rebrand.ly/plugin-slider-premium"
						target="_blank" // eslint-disable-line
						rel="noopener"
						title={ __( 'Visit Site' ) }
					>
						{ __( 'Visit Site' ) }
					</a>
				</div>
			</Modal>
		)
	}
}

export default ProModalPricing
