/**
 * External dependencies
 */
import { AlignButtonsControl } from '~stackable/components'
import ResponsiveControl from '../responsive-control'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../../../util/props'

const ContentAlignControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, CONTENT_ALIGN_CONTROL_DEFAULT_PROPS )
	return (
		<ResponsiveControl
			attrNameTemplate="%sContentAlign"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.blockAttributes }
		>
			<AlignButtonsControl
				label={ props.label }
				className={ classnames( [ props.className, 'ugb--help-tip-alignment-all' ] ) }
			/>
		</ResponsiveControl>
	)
}

const CONTENT_ALIGN_CONTROL_DEFAULT_PROPS = {
	className: '',
	setAttributes: () => {},
	blockAttributes: {},
	label: __( 'Align', i18n ),
}

export default ContentAlignControl
