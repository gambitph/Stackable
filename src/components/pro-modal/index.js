import { pricingURL, srcUrl } from 'stackable'
import { __ } from '@wordpress/i18n'
import ImageCover from './images/cover.jpg'
import ImageEffects from './images/effects.jpg'
import ImageLayouts from './images/layouts.jpg'
import ImageOthers from './images/others.jpg'
import ImageSeamless from './images/seamless.jpg'
import { Modal } from '@wordpress/components'
import Swiper from 'react-id-swiper'
import { withState } from '@wordpress/compose'

const ProModal = props => {
	const {
		isOpen = false,
		setState,
		button = __( 'Learn More' ),
		buttonClassName = 'button button-secondary',
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

	return (
		<div>
			{ /* eslint-disable-next-line */ }
			<a onClick={ () => setState( { isOpen: true } ) } className={ buttonClassName }>{ button }</a>
			{ isOpen && (
				<Modal
					className="ugb-pro-modal"
					onRequestClose={ () => setState( { isOpen: false } ) }
				>
					<Swiper { ...swiperParams }>
						<img src={ srcUrl + '/' + ImageCover } alt={ __( 'Do more with Stackable Premium' ) } />
						<img src={ srcUrl + '/' + ImageLayouts } alt={ __( 'Premium Layouts' ) } />
						<img src={ srcUrl + '/' + ImageSeamless } alt={ __( 'Seamless Layouts Switching' ) } />
						<img src={ srcUrl + '/' + ImageEffects } alt={ __( 'Premium Effects' ) } />
						<img src={ srcUrl + '/' + ImageOthers } alt={ __( 'Other Features' ) } />
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
		</div>
	)
}

export default withState( {
	isOpen: false,
} )( ProModal )
