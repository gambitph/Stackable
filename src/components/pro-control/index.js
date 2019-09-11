/**
 * Internal dependencies
 */
import ProModal from '../pro-modal'
import SVGProIcon from './images/pro-icon.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const LABELS = {
	layout: {
		title: __( 'Say Hello to More Layouts 👋', i18n ),
		description: __( 'Get more layouts for this block. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	image: {
		title: __( 'Say Hello to More Shapes 👋', i18n ),
		description: __( 'Get more cool shapes for your images. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	advanced: {
		title: __( 'Say Hello to Fine-Grained Controls 👋', i18n ),
		description: __( 'Get more advanced block options for adjusting column colors and more. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
}

const ProControl = props => {
	return (
		<div className="ugb-design-control-pro-note">
			<SVGProIcon />
			<h4>{ props.title || LABELS[ props.type ].title }</h4>
			<p>{ props.description || LABELS[ props.type ].description }</p>
			<ProModal button={ props.button || LABELS[ props.type ].button } />
		</div>
	)
}

ProControl.defaultProps = {
	type: 'layout',
	title: '',
	description: '',
	button: '',
}

export default ProControl
