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
	design: {
		title: __( 'Say Hello to More Designs 👋', i18n ),
		description: __( 'Get more pre-set sections / designs for this block. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	image: {
		title: __( 'Say Hello to More Shapes 👋', i18n ),
		description: __( 'Get more cool shapes for your images. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	effect: {
		title: __( 'Say Hello to More Effects 👋', i18n ),
		description: __( 'Get more flashy image & hover effects. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	advanced: {
		title: __( 'Say Hello to Fine-Grained Controls 👋', i18n ),
		description: __( 'Get column spacing options, column colors and more. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	postsBlock: {
		title: __( 'Say Hello to More Post Controls 👋', i18n ),
		description: __( 'Get a load more button, more post options and Custom Post Types. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
	typographyStyles: {
		title: __( 'Say Hello to Typography Styles 👋', i18n ),
		description: __( 'Save your typography styles, assign them to your blocks and adjust them globally. This feature is only available on Stackable Premium.', i18n ),
		button: __( 'Learn More', i18n ),
	},
}

const ProControl = props => {
	return (
		<div className="ugb-design-control-pro-note">
			<SVGProIcon />
			<h4>{ props.title || LABELS[ props.type ].title }</h4>
			<p>{ props.description || LABELS[ props.type ].description }</p>
			{ props.showButton && <ProModal button={ props.button || LABELS[ props.type ].button } /> }
			<p className="ugb-design-control-pro-note__notice">{ __( 'You can hide premium hints in the settings', i18n ) }</p>
		</div>
	)
}

ProControl.defaultProps = {
	type: 'layout',
	title: '',
	description: '',
	button: '',
	showButton: true,
}

export default ProControl
