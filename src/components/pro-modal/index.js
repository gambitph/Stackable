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
						<img src={ srcUrl + '/' + ImageCover } alt={ __( '50 Premium Layouts' ) } />
						<img src={ srcUrl + '/' + ImageLayouts } alt={ __( '50 Premium Layouts' ) } />
						<img src={ srcUrl + '/' + ImageSeamless } alt={ __( 'Seamless Layout Switching' ) } />
						<img src={ srcUrl + '/' + ImageEffects } alt={ __( '50 Premium Layouts' ) } />
						<img src={ srcUrl + '/' + ImageOthers } alt={ __( 'Seamless Layout Switching' ) } />
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
							target="_blank"
							rel="noopener noreferrer"
							title={ __( 'Try Demo' ) }
						>
							{ __( 'Try Demo' ) }
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
