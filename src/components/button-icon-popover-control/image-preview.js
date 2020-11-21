/**
 * Internal dependencies
 */
import SVGImageIcon from './images/image.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { Button } from '@wordpress/components'

const ImagePreview = props => {
	return (
		<Fragment>
			<div className="components-circular-option-picker__option-wrapper ugb-button-icon-popover-control-image-preview">
				<Button
					className="components-circular-option-picker__option"
					label={ __( 'Selected image', i18n ) }
					style={ { backgroundImage: props.imageUrl ? `url(${ props.imageUrl })` : undefined } }
					onClick={ props.onClick }
					ref={ props._ref }
				>
					{ ! props.imageUrl && <SVGImageIcon /> }
				</Button>
				{ props.children }
			</div>
		</Fragment>
	)
}

ImagePreview.defaultProps = {
	imageUrl: '',
	onClick: () => {},
	_ref: null,
}

export default ImagePreview
