/**
 * External dependencies
 */
//import classnames from 'classnames'
//import { version as VERSION } from 'stackable'
import {
	// InspectorTabs,
	ButtonEditHelper,
} from '~stackable/components'
//import { useBlockContext, useBlockStyle } from '~stackable/hooks'
import {
	withIsHovered,
} from '~stackable/higher-order'
//import {
	//Column,
	//getColumnClasses,
	//BlockDiv,
	//Style,
	//Image,
	//getAlignmentClasses,
	//Alignment,
	//useAlignment,
	//Advanced,
	//CustomCSS,
	//Responsive,
	//ContainerDiv,
	//Linking,
	//BlockStyle,
//} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const Edit = props => {
	const {
		setAttributes, attributes,
	} = props

	return (
		<ButtonEditHelper
			className="stk-button"
			setAttributes={ setAttributes }
			blockAttributes={ attributes }
		/>
	)
}

export default compose(
	withIsHovered
)( Edit )
