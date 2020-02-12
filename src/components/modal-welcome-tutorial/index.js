import {
	Button, Modal,
} from '@wordpress/components'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

const ModalWelcomeTutorial = props => {
	return (
		<Modal
			title={ __( 'Stackable Welcome Guide', i18n ) }
			className="ugb-modal-welcome-video"
			overlayClassName="ugb-modal-welcome-video__overlay"
			shouldCloseOnClickOutside={ false }
			onRequestClose={ props.onRequestClose }
		>
			<p>{ __( 'Hello there 👋 I see you might be new to Stackable, we\'ve made a short 3-minute video so you can make the most out of our unique blocks.', i18n ) }</p>
			<iframe
				title={ __( 'Video Tutorial', i18n ) }
				width="800"
				height="413"
				src="https://www.youtube.com/embed/UW0Rg96aATA"
				frameBorder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<p>
				<Button className="button-primary" onClick={ props.onRequestClose } data-testid="button-close">
					{ __( 'Close it, I\'m good', i18n ) }
				</Button>
			</p>
		</Modal>
	)
}

ModalWelcomeTutorial.defaultProps = {
	onRequestClose: () => {},
}

export default ModalWelcomeTutorial
