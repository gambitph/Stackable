/**
 * Internal dependencies
 */
import Button from '../button'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const ColorPreview = props => {
	let backgroundColor = props.color || 'transparent'
	if ( Array.isArray( backgroundColor ) ) {
		const [ color1, color2 ] = backgroundColor
		backgroundColor = `linear-gradient(90deg, ${ color1 || 'transparent' }, ${ color2 || 'transparent' })`
	}

	const classNames = classnames( [
		'components-circular-option-picker__option-wrapper',
		'ugb-button-icon-popover-control-color-preview',
	], {
		'ugb-button-icon-popover-control-color-preview--transparent': ! backgroundColor || backgroundColor === 'transparent',
	} )

	return (
		<Fragment>
			<div className={ classNames }>
				<Button
					className="components-circular-option-picker__option"
					label={ __( 'Selected color', i18n ) }
					style={ { background: backgroundColor } }
					onClick={ props.onClick }
					ref={ props._ref }
				/>
				{ props.children }
			</div>
		</Fragment>
	)
}

ColorPreview.defaultProps = {
	color: '',
	onClick: () => {},
	_ref: null,
}

export default ColorPreview
