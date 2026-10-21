/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { TextareaControl, ExternalLink } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useInternalValue } from '~stackable/hooks'
import { getPropsWithDefaults } from '../../util/props'

const ImageAltControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, IMAGE_ALT_CONTROL_DEFAULT_PROPS )
	// Keep track of the internal value because we will move the cursor to the
	// end of the text when the user types.
	const [ internalValue, setInternalValue ] = useInternalValue( props.value )

	return (
		<TextareaControl
			{ ...props }
			value={ internalValue }
			onChange={ value => {
				setInternalValue( value )
				props.onChange( value )
			} }
			help={
				<>
					<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
						{ __( 'Describe the purpose of the image', i18n ) }
					</ExternalLink>
					{ __( 'Leave empty if the image is purely decorative.', i18n ) }
				</>
			}
			__nextHasNoMarginBottom
		/>
	)
}

const IMAGE_ALT_CONTROL_DEFAULT_PROPS = {
	label: __( 'Alt Text (Alternative Text)', i18n ),
}

export default ImageAltControl
