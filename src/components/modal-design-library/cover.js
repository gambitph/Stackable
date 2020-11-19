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
		onChange,
		value,
		title,
		description,
		placeholder,
	} = props

	// Generate color style.
	const wrapperStyle = {
		backgroundColor: typeof color === 'string' ? color : undefined,
		backgroundImage: ( Array.isArray( color ) && color.length === 2 ) ?
			`linear-gradient(90deg, ${ color[ 0 ] }, ${ color[ 1 ] })` :
			undefined,
	}

	return (
		<div className="ugb-modal-design-library__cover-wrapper" style={ wrapperStyle }>
			<div className="ugb-modal-design-library__cover-inner">
				<h2>
					<img src={ `${ srcUrl }/${ Logo }` } alt="ugb-stk-logo" />
					{ title }
				</h2>
				{ description && (
					<p>{ description }</p>
				) }
				<TextControl
					className="ugb-shadow-5"
					placeholder={ placeholder }
					value={ value }
					onChange={ onChange }
					data-test-id="input-search"
				/>
			</div>
		</div>
	)
}

Cover.defaultProps = {
	color: '#e74673',
	onChange: () => {},
	value: '',
	title: '',
	description: '',
	placeholder: '',
}

export default Cover
