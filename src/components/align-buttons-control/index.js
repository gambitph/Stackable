/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'
import { omit } from 'lodash'
import classnames from 'classnames'

const ALIGN_OPTIONS = [
	{
		value: 'left',
		title: __( 'Align Left', i18n ),
		icon: 'editor-alignleft',
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: 'editor-aligncenter',
	},
	{
		value: 'right',
		title: __( 'Align Right', i18n ),
		icon: 'editor-alignright',
	},
	{
		value: 'justify',
		title: __( 'Justified', i18n ),
		icon: 'editor-justify',
	},
]

const AlignButtonsControl = props => {
	const {
		justified,
		className,
	} = props

	return (
		<AdvancedToolbarControl
			{ ...omit( props, [ 'justified' ] ) }
			className={ classnames( [ className, 'ugb-align-buttons-control' ] ) }
			controls={
				ALIGN_OPTIONS.filter( option => {
					return ! justified ? option.value !== 'justify' : true
				} )
			}
		/>
	)
}

AlignButtonsControl.defaultProps = {
	className: '',
	label: __( 'Align', i18n ),
	value: ALIGN_OPTIONS[ 0 ].value,
	justified: false,
}

export default AlignButtonsControl
