import { __ } from '@wordpress/i18n'
import { Modal } from '@wordpress/components'
import { pricingURL } from 'stackable'
import Swiper from 'react-id-swiper'
import { withState } from '@wordpress/compose'

const ProModal = props => {
	const {
		isOpen = false,
		setState,
		button = __( 'Learn More' ),
		buttonClassName = 'button button-secondary',
		tag = 'div',
	} = props

	// Slider params.
	const swiperParams = {
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	}

	const Tag = tag

	return (
		<Tag>
			{ /* eslint-disable-next-line */ }
			<a onClick={ () => setState( { isOpen: true } ) } className={ buttonClassName }>{ button }</a>
			{ isOpen && (
				<Modal
					className="ugb-pro-modal"
					onRequestClose={ () => setState( { isOpen: false } ) }
				>
					<Swiper { ...swiperParams }>
						<img src="https://gambitph.github.io/Stackable/assets/premium-slider/cover.jpg" alt={ __( 'Do more with Stackable Premium' ) } />
						<img src="https://gambitph.github.io/Stackable/assets/premium-slider/layouts.jpg" alt={ __( 'Premium Layouts' ) } />
						<img src="https://gambitph.github.io/Stackable/assets/premium-slider/seamless.jpg" alt={ __( 'Seamless Layouts Switching' ) } />
						<img src="https://gambitph.github.io/Stackable/assets/premium-slider/effects.jpg" alt={ __( 'Premium Effects' ) } />
						<img src="https://gambitph.github.io/Stackable/assets/premium-slider/others.jpg" alt={ __( 'Other Features' ) } />
					</Swiper>
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
			) }
		</Tag>
	)
}

export default withState( {
	isOpen: false,
} )( ProModal )
