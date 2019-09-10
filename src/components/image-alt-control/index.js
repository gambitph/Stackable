/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { TextareaControl, ExternalLink } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const ImageAltControl = props => {
	return (
		<TextareaControl
			{ ...props }
			help={
				<Fragment>
					<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
						{ __( 'Describe the purpose of the image', i18n ) }
					</ExternalLink>
					{ __( 'Leave empty if the image is purely decorative.', i18n ) }
				</Fragment>
			}
		/>
	)
}

ImageAltControl.defaultProps = {
	label: __( 'Alt Text (Alternative Text)', i18n ),
}

export default ImageAltControl
