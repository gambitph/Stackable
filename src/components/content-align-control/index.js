import { AlignButtonsControl, ResponsiveControl } from '@stackable/components'
import { __ } from '@wordpress/i18n'

const ContentAlignControl = props => {
	return (
		<ResponsiveControl
			attrNameTemplate="%sContentAlign"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.blockAttributes }
		>
			<AlignButtonsControl label={ __( 'Align' ) } />
		</ResponsiveControl>
	)
}

ContentAlignControl.defaultProps = {
	setAttributes: () => {},
	blockAttributes: {},
}

export default ContentAlignControl
