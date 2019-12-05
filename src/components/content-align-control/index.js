/**
 * External dependencies
 */
import { AlignButtonsControl, ResponsiveControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const ContentAlignControl = props => {
	return (
		<ResponsiveControl
			attrNameTemplate="%sContentAlign"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.blockAttributes }
		>
			<AlignButtonsControl
				label={ __( 'Align', i18n ) }
				className={ props.className }
			/>
		</ResponsiveControl>
	)
}

ContentAlignControl.defaultProps = {
	className: '',
	setAttributes: () => {},
	blockAttributes: {},
}

export default ContentAlignControl
