/**
 * External dependencies
 */
import { i18n, srcUrl } from 'stackable'

/**
 * Wordpress dependencies
 */
import { TextControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import Logo from './images/Logo.png'

const Cover = props => {
	const {
		color,
	} = props

	// Generate color style.
	const wrapperStyle = {
		backgroundColor: color,
	}

	return (
		<div className="ugb-modal-design-library__cover-wrapper" style={ wrapperStyle }>
			<div className="ugb-modal-design-library__cover-inner">
				<h2>
					<img src={ `${ srcUrl }/${ Logo }` } alt="ugb-stk-logo" />
					{ __( 'Stackable Block Designs', i18n ) }
				</h2>
				<p>{ __( 'Choose from over 200 predesigned templates you can customize with Stackable.', i18n ) }</p>
				<TextControl
					className="ugb-shadow-5"
					placeholder={ __( 'Ex: Corporate, Minimalist, Header, etc.', i18n ) }
				/>
			</div>
		</div>
	)
}

Cover.defaultProps = {
	color: '#e74673',
}

export default Cover
