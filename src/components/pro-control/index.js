/**
 * Internal dependencies
 */
import ProModal from '../pro-modal'
import SVGProIcon from './images/pro-icon.svg'
import Button from '../button'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

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
}

const ProControl = props => {
	const classNames = classnames( [ 'ugb-design-control-pro-note', props.className ] )
	return (
		<div className={ classNames }>
			{ props.isDismissible && <Button className="ugb-design-control-pro-note__close" icon="no-alt" isTertiary onClick={ props.onClose } /> }
			<SVGProIcon className="ugb-design-control-pro-note__logo" />
			<h4>{ props.title || LABELS[ props.type ].title }</h4>
			<p>{ props.description || LABELS[ props.type ].description }</p>
			{ props.showButton && <ProModal button={ props.button || LABELS[ props.type ].button } buttonUtmSource={ props.buttonUtmSource } /> }
			{ props.showHideNote && <p className="ugb-design-control-pro-note__notice">{ __( 'You can hide premium hints in the settings', i18n ) }</p> }
		</div>
	)
}

ProControl.defaultProps = {
	className: '',
	type: 'layout',
	title: '',
	description: '',
	button: '',
	showButton: true,
	showHideNote: true,
	isDismissible: false,
	onClose: () => {},
	buttonUtmSource: undefined,
}

export default ProControl
