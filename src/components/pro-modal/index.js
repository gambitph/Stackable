/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { Modal } from '@wordpress/components'
import { SVGStackableIcon } from '~stackable/icons'

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
		const Tag = this.props.tag

		return (
			<Tag>
				<a href={ `https://wpstackable.com/upgrade/?utm_source=${ this.props.buttonUtmSource }&utm_campaign=learnmore&utm_medium=gutenberg` }
					target="_premium"
					onClick={ this.open }
					className={ this.props.buttonClassName }
				>
					{ this.props.button }
				</a>
				{ this.state.isOpen && (
					<Modal
						className="ugb-pro-modal"
						onRequestClose={ this.close }
					>
						<img src="https://da4bu55kgdxvv.cloudfront.net/premium-popup.jpg" alt={ __( 'Premium features', i18n ) } />
						<div className="ugb-pro-modal__footer">
							<a href="https://wpstackable.com/upgrade/?utm_source=editor-modal-popup&utm_campaign=upgrade&utm_medium=gutenberg"
								className="button button-secondary"
								target="_premium"
								title={ __( 'Upgrade to Premium', i18n ) }
							>
								<SVGStackableIcon />
								{ __( 'Upgrade to Premium', i18n ) }
							</a>
							<a href="https://demo.wpstackable.com?utm_source=editor-modal-popup&utm_campaign=trydemo&utm_medium=gutenberg"
								target="_premium"
								title={ __( 'Try Premium Demo', i18n ) }
							>
								{ __( 'Try Premium Demo', i18n ) }
							</a>
						</div>
					</Modal>
				) }
			</Tag>
		)
	}
}

ProModal.defaultProps = {
	button: __( 'Learn More', i18n ),
	buttonClassName: 'button button-secondary',
	tag: 'div',
	buttonUtmSource: 'editor-learn-more',
}
export default ProModal
