/**
 * Internal dependencies
 */
import SVGNext from './images/next.svg'
import SVGPrev from './images/prev.svg'

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

class ProModal extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isOpen: false,
			slide: 0,
		}
		this.open = this.open.bind( this )
		this.close = this.close.bind( this )
		this.prev = this.prev.bind( this )
		this.next = this.next.bind( this )
	}

	open() {
		this.setState( { isOpen: true } )
	}

	close() {
		this.setState( { isOpen: false } )
	}

	next() {
		const slide = this.state.slide >= 4 ? 0 : this.state.slide + 1
		this.setState( { slide } )
	}

	prev() {
		const slide = this.state.slide <= 0 ? 4 : this.state.slide - 1
		this.setState( { slide } )
	}

	render() {
		const {
			button = __( 'Learn More', i18n ),
			buttonClassName = 'button button-secondary',
			tag = 'div',
		} = this.props

		const Tag = tag

		return (
			<Tag>
				{ /* eslint-disable-next-line */ }
				<a onClick={ this.open } className={ buttonClassName }>{ button }</a>
				{ this.state.isOpen && (
					<Modal
						className="ugb-pro-modal"
						onRequestClose={ this.close }
					>
						<div className={ `ugb-pro-modal__carousel ugb-pro-modal__carousel--slide-${ this.state.slide }` }>
							<div className="ugb-pro-modal__carousel-wrapper">
								<img src="https://gambitph.github.io/Stackable/assets/premium-slider/cover.jpg" alt={ __( 'Do more with Stackable Premium', i18n ) } />
								<img src="https://gambitph.github.io/Stackable/assets/premium-slider/layouts.jpg" alt={ __( 'Premium Layouts', i18n ) } />
								<img src="https://gambitph.github.io/Stackable/assets/premium-slider/seamless.jpg" alt={ __( 'Seamless Layouts Switching', i18n ) } />
								<img src="https://gambitph.github.io/Stackable/assets/premium-slider/effects.jpg" alt={ __( 'Premium Effects', i18n ) } />
								<img src="https://gambitph.github.io/Stackable/assets/premium-slider/others.jpg" alt={ __( 'Other Features', i18n ) } />
							</div>
							<div className="ugb-pro-modal__carousel-left" onMouseDown={ this.prev } onKeyPress={ this.prev } role="button" tabIndex="0">
								<SVGPrev />
							</div>
							<div className="ugb-pro-modal__carousel-right" onMouseDown={ this.next } onKeyPress={ this.next } role="button" tabIndex="0">
								<SVGNext />
							</div>
						</div>
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
				) }
			</Tag>
		)
	}
}

export default ProModal
